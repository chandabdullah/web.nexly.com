export function formatBytes(value?: number) {
  if (!value || Number.isNaN(value)) {
    return 'Unknown size'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  let current = value
  let index = 0

  while (current >= 1024 && index < units.length - 1) {
    current /= 1024
    index += 1
  }

  return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${units[index]}`
}

export function buildQueryUrl(url: string) {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  hash.set('url', url)
  return `${window.location.pathname}#${hash.toString()}`
}
