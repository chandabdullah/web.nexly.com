export type PlatformKey =
  | 'youtube'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'x'
  | 'pinterest'
  | 'generic'
  | 'unknown'

export type PresetKey = 'high-video' | 'medium-video' | 'low-video' | 'audio'

export type MediaOption = {
  id: string
  kind: 'video' | 'audio'
  label: string
  subtitle: string
  fileName: string
  url: string
  totalBytes?: number
}

export type ResolveResponse = {
  title: string
  thumbnailUrl?: string
  sourceLabel: string
  options: MediaOption[]
}

export type DownloadState =
  | 'idle'
  | 'ready'
  | 'resolving'
  | 'resolved'
  | 'downloading'
  | 'success'
  | 'canceled'
  | 'error'

export type ProgressSnapshot = {
  status: string
  percent: number
  transferredBytes: number
  totalBytes?: number
}

export type DownloaderViewModel = {
  url: string
  normalizedUrl: string
  platform: PlatformKey
  platformLabel: string
  isValidUrl: boolean
  selectedOptionId?: string
  result?: ResolveResponse
  progress?: ProgressSnapshot
  state: DownloadState
  error?: string
}

export type DownloadTask = {
  id: string
  url: string
  normalizedUrl: string
  platform: PlatformKey
  platformLabel: string
  selectedOptionId?: string
  result?: ResolveResponse
  progress?: ProgressSnapshot
  state: Exclude<DownloadState, 'idle' | 'ready'>
  error?: string
}
