import { PlatformKey } from '../types/downloader'

const PLATFORM_RULES: Array<{ key: PlatformKey; label: string; hosts: string[] }> = [
  { key: 'youtube', label: 'YouTube', hosts: ['youtube.com', 'youtu.be'] },
  { key: 'instagram', label: 'Instagram', hosts: ['instagram.com'] },
  { key: 'facebook', label: 'Facebook', hosts: ['facebook.com', 'fb.watch'] },
  { key: 'tiktok', label: 'TikTok', hosts: ['tiktok.com'] },
  { key: 'x', label: 'X', hosts: ['x.com', 'twitter.com'] },
  { key: 'pinterest', label: 'Pinterest', hosts: ['pinterest.com', 'pin.it'] },
]

export function normalizeUrl(input: string) {
  return input.trim()
}

export function parseHttpUrl(input: string) {
  const normalized = normalizeUrl(input)

  if (!normalized) {
    return undefined
  }

  try {
    const parsed = new URL(normalized)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed : undefined
  } catch {
    return undefined
  }
}

export function detectPlatform(input: string) {
  const parsed = parseHttpUrl(input)

  if (!parsed) {
    return { key: 'unknown' as PlatformKey, label: 'Paste a supported link' }
  }

  const host = parsed.hostname.replace(/^www\./, '')
  const match = PLATFORM_RULES.find(({ hosts }) => hosts.some((item) => host === item || host.endsWith(`.${item}`)))

  if (match) {
    return { key: match.key, label: match.label }
  }

  return { key: 'generic' as PlatformKey, label: 'Website' }
}
