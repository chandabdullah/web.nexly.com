import { useEffect, useRef, useState } from 'react'
import { resolveMedia, startDownload } from '../services/downloadClient'
import { detectPlatform, normalizeUrl, parseHttpUrl } from '../utils/platform'
import { buildQueryUrl } from '../utils/format'
import { DownloadTask, DownloaderViewModel } from '../types/downloader'

const initialComposer: DownloaderViewModel = {
  url: '',
  normalizedUrl: '',
  platform: 'unknown',
  platformLabel: 'Paste a supported link',
  isValidUrl: false,
  state: 'idle',
}

function createTaskId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function useDownloader() {
  const [composer, setComposer] = useState<DownloaderViewModel>(initialComposer)
  const [tasks, setTasks] = useState<DownloadTask[]>([])
  const [activeTaskId, setActiveTaskId] = useState<string>()
  const abortControllersRef = useRef(new Map<string, AbortController>())

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const searchParams = new URLSearchParams(window.location.search)
    const prefilledUrl = hashParams.get('url') ?? searchParams.get('url')

    if (prefilledUrl) {
      updateUrl(prefilledUrl)
    }
  }, [])

  const activeTask = tasks.find((task) => task.id === activeTaskId)

  function updateUrl(value: string) {
    const normalized = normalizeUrl(value)
    const parsed = parseHttpUrl(normalized)
    const platform = detectPlatform(normalized)

    setComposer((current) => ({
      ...current,
      url: value,
      normalizedUrl: normalized,
      platform: platform.key,
      platformLabel: platform.label,
      isValidUrl: Boolean(parsed),
      error: undefined,
      state: parsed ? 'ready' : normalized ? 'error' : 'idle',
      result: undefined,
      progress: undefined,
      selectedOptionId: undefined,
    }))
  }

  function updateTask(taskId: string, updater: (task: DownloadTask) => DownloadTask) {
    setTasks((current) => current.map((task) => (task.id === taskId ? updater(task) : task)))
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText()
      updateUrl(text)
    } catch {
      setComposer((current) => ({
        ...current,
        error: 'Clipboard paste is blocked in this browser. Paste the link manually.',
        state: 'error',
      }))
    }
  }

  async function openPreset() {
    const parsed = parseHttpUrl(composer.normalizedUrl)

    if (!parsed) {
      setComposer((current) => ({
        ...current,
        error: 'Paste a valid video link and try again.',
        state: 'error',
      }))
      return
    }

    window.history.replaceState({}, '', buildQueryUrl(composer.normalizedUrl))

    const taskId = createTaskId()
    const nextTask: DownloadTask = {
      id: taskId,
      url: composer.url,
      normalizedUrl: composer.normalizedUrl,
      platform: composer.platform,
      platformLabel: composer.platformLabel,
      state: 'resolving',
      progress: {
        status: 'Resolving media details',
        percent: 0,
        transferredBytes: 0,
      },
    }

    setTasks((current) => [nextTask, ...current])
    setActiveTaskId(taskId)
    setComposer((current) => ({
      ...current,
      error: undefined,
      state: 'ready',
    }))

    try {
      const resolved = await resolveMedia({
        url: parsed.toString(),
        platformKey: composer.platform,
        platformLabel: composer.platformLabel,
      })

      updateTask(taskId, (task) => ({
        ...task,
        result: resolved,
        state: 'resolved',
        progress: undefined,
        selectedOptionId: resolved.options[0]?.id,
        error: undefined,
      }))
    } catch (error) {
      updateTask(taskId, (task) => ({
        ...task,
        state: 'error',
        progress: undefined,
        selectedOptionId: undefined,
        error: error instanceof Error ? error.message : 'Download failed',
      }))
    }
  }

  function selectTask(taskId: string) {
    setActiveTaskId(taskId)
  }

  function selectOption(optionId: string) {
    if (!activeTaskId) {
      return
    }

    updateTask(activeTaskId, (task) => ({
      ...task,
      selectedOptionId: optionId,
      error: undefined,
    }))
  }

  async function startSelectedDownload() {
    if (!activeTask) {
      return
    }

    const parsed = parseHttpUrl(activeTask.normalizedUrl)
    const option = activeTask.result?.options.find((item) => item.id === activeTask.selectedOptionId)

    if (!parsed || !option) {
      updateTask(activeTask.id, (task) => ({
        ...task,
        error: 'Resolve the media and select a quality before downloading.',
        state: 'error',
      }))
      return
    }

    const controller = new AbortController()
    abortControllersRef.current.set(activeTask.id, controller)

    updateTask(activeTask.id, (task) => ({
      ...task,
      state: 'downloading',
      error: undefined,
      progress: {
        status: 'Starting download',
        percent: 0,
        transferredBytes: 0,
        totalBytes: option.totalBytes,
      },
    }))

    try {
      await startDownload({
        option,
        signal: controller.signal,
        onProgress: (progress) => {
          updateTask(activeTask.id, (task) => ({
            ...task,
            state: progress.percent === 100 ? 'success' : 'downloading',
            progress,
          }))
        },
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        updateTask(activeTask.id, (task) => ({
          ...task,
          state: 'canceled',
          error: undefined,
          progress: {
            status: 'Download canceled',
            percent: 0,
            transferredBytes: 0,
          },
        }))
      } else {
        updateTask(activeTask.id, (task) => ({
          ...task,
          state: 'error',
          progress: undefined,
          error: error instanceof Error ? error.message : 'Download failed',
        }))
      }
    } finally {
      abortControllersRef.current.delete(activeTask.id)
    }
  }

  function cancelDownload(taskId: string) {
    abortControllersRef.current.get(taskId)?.abort()
  }

  return {
    composer,
    activeTask,
    tasks,
    actions: {
      updateUrl,
      pasteFromClipboard,
      openPreset,
      selectTask,
      selectOption,
      startSelectedDownload,
      cancelDownload,
    },
  }
}
