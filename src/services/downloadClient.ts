import { MediaOption, PlatformKey, ProgressSnapshot, ResolveResponse } from '../types/downloader'
import { selectPresetOption } from '../utils/preset'
import { resolveWebEndpoint } from '../utils/environment'

const RESOLVER_ENDPOINT = resolveWebEndpoint
const ALLOW_MOCKS = import.meta.env.VITE_ALLOW_MOCKS === 'true'
type ResolvePayload = {
  url: string
  platformKey: PlatformKey
  platformLabel: string
}

type DownloadPayload = {
  option: MediaOption
  onProgress: (snapshot: ProgressSnapshot) => void
  signal?: AbortSignal
}

type BackendResolveResponse = {
  title?: string
  thumbnail_url?: string
  file_name: string
  platform?: string
  options?: Array<{
    id: 'high' | 'medium' | 'low'
    label: string
    subtitle: string
    download_url: string
  }>
  resolved_url?: string
  download_urls?: Partial<Record<'high' | 'medium' | 'low', string>>
}

function isNetworkFailure(error: unknown) {
  return error instanceof TypeError && error.message === 'Failed to fetch'
}

function wait(duration: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })
}

async function mockDownload({ option, onProgress }: DownloadPayload) {
  const totalBytes = option.totalBytes ?? 24 * 1024 * 1024
  const steps = [8, 21, 38, 56, 73, 88, 100]

  for (const percent of steps) {
    onProgress({
      status: percent === 100 ? 'Download complete' : `Downloading ${percent}%`,
      percent,
      transferredBytes: Math.round((percent / 100) * totalBytes),
      totalBytes,
    })
    await wait(percent === 100 ? 240 : 420)
  }

  const blob = new Blob(
    [
      `Nexly demo download\n\nSelected option: ${option.label}\nFilename: ${option.fileName}\nThis fallback mock runs only when VITE_ALLOW_MOCKS=true.`,
    ],
    { type: 'text/plain;charset=utf-8' },
  )
  const fileUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = fileUrl
  anchor.download = option.fileName
  anchor.click()
  URL.revokeObjectURL(fileUrl)
}

function titleFromFileName(fileName: string) {
  const clean = fileName.replace(/\.[a-z0-9]+$/i, '').replace(/[_-]+/g, ' ').trim()
  return clean || 'Resolved video'
}

function extractYoutubeId(inputUrl: string) {
  try {
    const parsed = new URL(inputUrl)
    const host = parsed.host.toLowerCase()

    if (host.includes('youtu.be')) {
      return parsed.pathname.split('/').filter(Boolean)[0]
    }

    const queryId = parsed.searchParams.get('v')
    if (queryId) {
      return queryId
    }

    const segments = parsed.pathname.split('/').filter(Boolean)
    if (segments.length >= 2 && ['shorts', 'embed', 'live'].includes(segments[0])) {
      return segments[1]
    }
  } catch {
    return undefined
  }

  return undefined
}

function extensionFromFileName(fileName: string) {
  return fileName.includes('.') ? fileName.split('.').pop()?.toUpperCase() ?? 'FILE' : 'FILE'
}

function buildSingleResolvedOption(fileName: string, resolvedUrl: string): MediaOption {
  const parsed = new URL(resolvedUrl)
  const mime = parsed.searchParams.get('mime') ?? ''
  const itag = parsed.searchParams.get('itag') ?? ''
  const kind = mime.startsWith('audio/') ? 'audio' : 'video'

  let label = kind === 'audio' ? 'Best audio' : 'Best available'
  if (itag === '18') label = '360p'
  if (itag === '22') label = '720p'
  if (itag === '37') label = '1080p'
  if (itag === '140') label = '128 kbps'
  if (itag === '251') label = '160 kbps'

  return {
    id: 'resolved_best',
    kind,
    label,
    subtitle: kind === 'audio' ? `Audio only • ${extensionFromFileName(fileName)} • Direct stream` : `Video + audio • ${extensionFromFileName(fileName)} • Direct stream`,
    fileName,
    url: resolvedUrl,
    totalBytes: undefined,
  }
}

function buildPresetResolvedOptions(
  options: MediaOption[],
  downloadUrls?: BackendResolveResponse['download_urls'],
  explicitOptions?: BackendResolveResponse['options'],
) {
  if (explicitOptions?.length) {
    return explicitOptions.map((option) => ({
      id: `preset_${option.id}`,
      kind: 'video' as const,
      label: option.label,
      subtitle: `${option.subtitle} • MP4`,
      fileName: options[0]?.fileName ?? 'video.mp4',
      url: option.download_url,
      totalBytes: undefined,
    }))
  }

  const high = selectPresetOption(options, 'high-video')
  const medium = selectPresetOption(options, 'medium-video')
  const low = selectPresetOption(options, 'low-video')

  const presets = [
    { key: 'high', title: 'High', caption: 'Best possible quality for this link', option: high, url: downloadUrls?.high },
    { key: 'medium', title: 'Medium', caption: 'Balanced quality preset', option: medium, url: downloadUrls?.medium },
    { key: 'low', title: 'Low', caption: 'Smaller-size quality preset', option: low, url: downloadUrls?.low },
  ]

  return presets
    .filter((preset): preset is (typeof presets)[number] & { option: MediaOption } => Boolean(preset.option))
    .map(({ key, title, caption, option, url }) => ({
      ...option,
      id: `preset_${key}`,
      label: title,
      url: url ?? option.url,
      subtitle:
        option.kind === 'audio'
          ? `${caption} • Audio • ${extensionFromFileName(option.fileName)}`
          : `${caption} • Video • ${extensionFromFileName(option.fileName)}`,
    }))
}

function sourceLabelFromBackend(platform: string | undefined, fallback: string) {
  if (!platform) return fallback
  const normalized = platform.trim()
  if (!normalized) return fallback
  if (normalized.toLowerCase() === 'youtube') return 'YouTube'
  return normalized
}

function toResolveResponse(inputUrl: string, platformLabel: string, backend: BackendResolveResponse): ResolveResponse {
  const title = backend.title?.trim() || titleFromFileName(backend.file_name)
  const sourceLabel = sourceLabelFromBackend(backend.platform, platformLabel)
  const youtubeId = extractYoutubeId(inputUrl)
  const baseOption =
    backend.resolved_url
      ? [buildSingleResolvedOption(backend.file_name, backend.resolved_url)]
      : [
        {
          id: 'resolved_best',
          kind: 'video' as const,
          label: 'High',
          subtitle: `Video • ${extensionFromFileName(backend.file_name)}`,
          fileName: backend.file_name,
          url: backend.options?.[0]?.download_url ?? '',
          totalBytes: undefined,
        },
      ]
  const options = buildPresetResolvedOptions(baseOption, backend.download_urls, backend.options)

  return {
    title,
    sourceLabel,
    thumbnailUrl: backend.thumbnail_url || (sourceLabel === 'YouTube' && youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined),
    options,
  }
}

export async function resolveMedia({ url, platformKey, platformLabel }: ResolvePayload): Promise<ResolveResponse> {
  if (!RESOLVER_ENDPOINT) {
    if (ALLOW_MOCKS) {
      const { buildMockResolve } = await import('./mockData')
      await wait(700)
      return buildMockResolve(url, platformLabel, platformKey)
    }

    throw new Error('Resolver endpoint is not configured.')
  }

  let response: Response

  try {
    response = await fetch(RESOLVER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
  } catch (error) {
    if (isNetworkFailure(error)) {
      throw new Error(
        'Resolver request could not reach the backend. Check src/utils/environment.ts and confirm your backend is running.',
      )
    }

    throw error instanceof Error ? error : new Error('Resolver request failed')
  }

  if (!response.ok) {
    const body = await response.text()
    let message = body || 'This video could not be resolved right now.'

    try {
      const data = JSON.parse(body) as { detail?: string }
      if (data.detail) {
        message = data.detail
      }
    } catch { }

    throw new Error(message)
  }

  const data = (await response.json()) as BackendResolveResponse

  if (!data.file_name || (!data.resolved_url && !data.options?.length)) {
    if (ALLOW_MOCKS) {
      const { buildMockResolve } = await import('./mockData')
      await wait(700)
      return buildMockResolve(url, platformLabel, platformKey)
    }

    throw new Error('Resolver returned an invalid response.')
  }

  return toResolveResponse(url, platformLabel, data)
}

export async function startDownload({ option, onProgress, signal }: DownloadPayload) {
  if (option.url.startsWith('mock://') && ALLOW_MOCKS) {
    return mockDownload({ option, onProgress })
  }

  onProgress({
    status: 'Preparing download',
    percent: 0,
    transferredBytes: 0,
    totalBytes: option.totalBytes,
  })

  try {
    const response = await fetch(option.url, { signal })

    if (!response.ok) {
      throw new Error('The download endpoint did not respond successfully.')
    }

    const totalBytes = Number(response.headers.get('content-length') ?? option.totalBytes ?? 0) || undefined
    const fileNameFromHeader = response.headers.get('content-disposition')
    const matchedFileName = fileNameFromHeader?.match(/filename="?([^"]+)"?/)
    const downloadFileName = matchedFileName?.[1] ?? option.fileName

    onProgress({
      status: 'Downloading',
      percent: 14,
      transferredBytes: 0,
      totalBytes,
    })

    if (!response.body) {
      throw new Error('The download response did not include a stream.')
    }

    const reader = response.body.getReader()
    const chunks: BlobPart[] = []
    let transferredBytes = 0

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      if (value) {
        chunks.push(value)
        transferredBytes += value.length
        const percent = totalBytes ? Math.min(99, Math.round((transferredBytes / totalBytes) * 100)) : Math.min(95, 14 + chunks.length * 6)

        onProgress({
          status: totalBytes ? `Downloading ${percent}%` : 'Downloading',
          percent,
          transferredBytes,
          totalBytes,
        })
      }
    }

    const blob = new Blob(chunks)
    const fileUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = fileUrl
    anchor.download = downloadFileName
    anchor.click()
    URL.revokeObjectURL(fileUrl)

    onProgress({
      status: 'Download complete',
      percent: 100,
      transferredBytes: totalBytes ?? transferredBytes,
      totalBytes,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    throw error instanceof Error ? error : new Error('Download failed')
  }
}
