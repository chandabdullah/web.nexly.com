import { MediaOption, PresetKey } from '../types/downloader'

function resolutionValue(label: string) {
  const match = label.match(/(\d{3,4})p/i)
  return match ? Number(match[1]) : 0
}

function sortVideoOptions(options: MediaOption[]) {
  return [...options].sort((left, right) => {
    const resolutionDelta = resolutionValue(right.label) - resolutionValue(left.label)

    if (resolutionDelta !== 0) {
      return resolutionDelta
    }

    return (right.totalBytes ?? 0) - (left.totalBytes ?? 0)
  })
}

export function selectPresetOption(options: MediaOption[], preset: PresetKey) {
  if (preset === 'audio') {
    const audioOptions = options.filter((option) => option.kind === 'audio')
    return sortVideoOptions(audioOptions)[0] ?? options.find((option) => option.kind === 'audio')
  }

  const videoOptions = sortVideoOptions(options.filter((option) => option.kind === 'video'))

  if (!videoOptions.length) {
    return undefined
  }

  if (preset === 'high-video') {
    return videoOptions[0]
  }

  if (preset === 'medium-video') {
    return videoOptions[Math.floor(videoOptions.length / 2)]
  }

  return [...videoOptions].reverse()[0]
}
