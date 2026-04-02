import { PlatformKey, ResolveResponse } from '../types/downloader'

const TITLES: Record<PlatformKey, string> = {
  youtube: 'YouTube video',
  instagram: 'Instagram reel',
  facebook: 'Facebook video',
  tiktok: 'TikTok video',
  x: 'X video',
  pinterest: 'Pinterest video',
  generic: 'Web video',
  unknown: 'Shared video',
}

function prettifySlug(value: string) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\.[a-z0-9]+$/i, '')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function looksLikeOpaqueId(value: string) {
  const compact = value.replace(/[-_\s]/g, '')
  return compact.length >= 8 && compact.length <= 20 && /^[a-z0-9]+$/i.test(compact) && !/[aeiou]{2,}/i.test(compact)
}

function getFallbackTitle(url: string, platformLabel: string, platformKey: PlatformKey) {
  try {
    const parsed = new URL(url)
    const segments = parsed.pathname.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]
    const queryTitle =
      parsed.searchParams.get('title') ??
      parsed.searchParams.get('text') ??
      parsed.searchParams.get('caption') ??
      parsed.searchParams.get('v')

    const candidate = queryTitle || lastSegment

    if (candidate) {
      const prettyCandidate = prettifySlug(candidate)

      if (!looksLikeOpaqueId(prettyCandidate)) {
        return prettyCandidate
      }
    }
  } catch {
    return `${platformLabel} ${TITLES[platformKey]}`
  }

  return `${platformLabel} ${TITLES[platformKey]}`
}

export function buildMockResolve(url: string, platformLabel: string, platformKey: PlatformKey): ResolveResponse {
  const title = getFallbackTitle(url, platformLabel, platformKey)

  return {
    title,
    sourceLabel: platformLabel,
    options: [
      {
        id: 'video_1080p',
        kind: 'video',
        label: '1080p',
        subtitle: 'Video + audio • MP4 • 54 MB',
        fileName: `${title.toLowerCase().replaceAll(' ', '-')}-1080p.mp4`,
        url: 'mock://video_1080p',
        totalBytes: 54 * 1024 * 1024,
      },
      {
        id: 'video_720p',
        kind: 'video',
        label: '720p',
        subtitle: 'Video + audio • MP4 • 29 MB',
        fileName: `${title.toLowerCase().replaceAll(' ', '-')}-720p.mp4`,
        url: 'mock://video_720p',
        totalBytes: 29 * 1024 * 1024,
      },
      {
        id: 'video_480p',
        kind: 'video',
        label: '480p',
        subtitle: 'Video + audio • MP4 • 13 MB',
        fileName: `${title.toLowerCase().replaceAll(' ', '-')}-480p.mp4`,
        url: 'mock://video_480p',
        totalBytes: 13 * 1024 * 1024,
      },
      {
        id: 'audio_best',
        kind: 'audio',
        label: '128 kbps',
        subtitle: 'Audio only • M4A • 4 MB',
        fileName: `${title.toLowerCase().replaceAll(' ', '-')}.m4a`,
        url: 'mock://audio_best',
        totalBytes: 4 * 1024 * 1024,
      },
    ],
  }
}
