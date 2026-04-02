import { useEffect, useRef } from 'react'
import { CheckCircle2, Download, ImageOff, LoaderCircle, Sparkles, TriangleAlert, XCircle } from 'lucide-react'
import { DownloadState, DownloadTask, MediaOption, ProgressSnapshot } from '../../types/downloader'
import { formatBytes } from '../../utils/format'

type ProgressPanelProps = {
  task?: DownloadTask
  tasks: DownloadTask[]
  onSelectTask: (taskId: string) => void
  onSelectOption: (optionId: string) => void
  onDownload: () => void
  onCancel: (taskId: string) => void
}

function optionLabel(option: MediaOption) {
  return option.label
}

function progressMetaLabel(progress?: ProgressSnapshot) {
  if (!progress) {
    return null
  }

  if (progress.status.toLowerCase().includes('resolving')) {
    return 'Resolving link'
  }

  if (progress.status.toLowerCase().includes('browser')) {
    return 'Added to downloads'
  }

  if (progress.totalBytes) {
    return `${formatBytes(progress.transferredBytes)} / ${formatBytes(progress.totalBytes)}`
  }

  if (progress.percent === 100) {
    return 'Added to downloads'
  }

  return 'Waiting for size'
}

function taskSummary(state: DownloadState, progress?: ProgressSnapshot) {
  if (state === 'success') return 'Complete'
  if (state === 'error') return 'Failed'
  if (state === 'canceled') return 'Canceled'
  if (state === 'downloading') return progress?.status ?? 'Downloading'
  if (state === 'resolved') return 'Ready'
  if (state === 'resolving') return 'Resolving'
  return 'Pending'
}

export function ProgressPanel({ task, tasks, onSelectTask, onSelectOption, onDownload, onCancel }: ProgressPanelProps) {
  const panelRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!task) {
      return
    }

    window.requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [task?.id, task?.state])

  if (!task && tasks.length === 0) {
    return null
  }

  const state = task?.state ?? 'resolved'
  const progress = task?.progress
  const result = task?.result
  const error = task?.error
  const selectedOption = result?.options.find((option) => option.id === task?.selectedOptionId)
  const isBusy = state === 'resolving' || state === 'downloading'
  const isResolving = state === 'resolving'

  const Icon =
    state === 'success'
      ? CheckCircle2
      : state === 'error'
        ? TriangleAlert
        : state === 'canceled'
          ? XCircle
          : state === 'resolving'
            ? Sparkles
            : LoaderCircle

  return (
    <section ref={panelRef} id="download-panel" className="section-shell scroll-mt-28 p-5 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          {task ? (
            <>
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                    state === 'success'
                      ? 'bg-emerald-50 text-emerald-500'
                      : state === 'error' || state === 'canceled'
                        ? 'bg-rose-50 text-rose-500'
                        : 'bg-sky-50 text-sky-600'
                  }`}
                >
                  <Icon className={`h-7 w-7 ${state === 'downloading' ? 'animate-spin' : ''}`} />
                </span>
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-skybrand-600">Transfer Status</p>
                  <h3 className="font-display text-[2rem] font-bold tracking-tight text-slate-900">
                    {progress?.status ??
                      (state === 'error'
                        ? 'Download failed'
                        : state === 'canceled'
                          ? 'Download canceled'
                          : state === 'resolved'
                            ? 'Ready for download'
                            : 'Resolving media')}
                  </h3>
                  <p className="max-w-2xl text-base leading-7 text-slate-500">
                    {result ? `${result.title} • ${result.sourceLabel}` : 'Resolving title, thumbnail, and available quality options for this link.'}
                  </p>
                </div>
              </div>

              {progress ? (
                <div className="mt-6 space-y-3">
                  <div className="h-3 overflow-hidden rounded-full bg-skybrand-100">
                    {isResolving ? (
                      <div className="h-full w-1/3 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" />
                    ) : (
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${progress.percent}%` }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 text-sm font-medium text-slate-500 sm:flex-row sm:justify-between">
                    <span>{isResolving ? 'Resolving...' : progress.status.toLowerCase().includes('browser') ? 'Added to downloads' : `${progress.percent}% complete`}</span>
                    <span>{progressMetaLabel(progress)}</span>
                  </div>
                </div>
              ) : null}

              {result ? (
                <div className="mt-6 flex flex-col gap-4 rounded-[1.6rem] border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center">
                  <div className="h-28 w-full overflow-hidden rounded-[1.2rem] bg-slate-100 sm:w-44">
                    {result.thumbnailUrl ? (
                      <img src={result.thumbnailUrl} alt={result.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[linear-gradient(135deg,#eef7ff_0%,#f8fbff_100%)] text-slate-400">
                        <ImageOff className="h-6 w-6" />
                        <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Preview unavailable</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-skybrand-600">{result.sourceLabel}</p>
                    <h4 className="mt-2 line-clamp-2 font-display text-2xl font-bold tracking-tight text-slate-900">{result.title}</h4>
                    <p className="mt-2 text-sm text-slate-500">
                      {error
                        ? error
                        : state === 'success'
                          ? 'The file has been added to your browser or download manager.'
                          : state === 'canceled'
                            ? 'This download was canceled. You can select a quality and start it again.'
                            : 'Preset qualities are ready. Choose High, Medium, or Low and start the download below.'}
                    </p>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-skybrand-600">Download Options</p>
              <h4 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900">Select quality</h4>
            </div>
            {selectedOption ? (
              <div className="rounded-[1rem] border border-skybrand-200 bg-skybrand-50/50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Selected</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{optionLabel(selectedOption)}</p>
              </div>
            ) : null}
          </div>

          {result ? (
            <div className="mt-5 space-y-3">
              {result.options.map((option) => {
                const selected = option.id === task?.selectedOptionId

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelectOption(option.id)}
                    disabled={isBusy}
                    className={`flex w-full items-center justify-between rounded-[1.4rem] border px-4 py-4 text-left transition ${
                      selected
                        ? 'border-sky-500 bg-skybrand-50/50'
                        : 'border-slate-100 bg-white hover:border-skybrand-200 hover:bg-skybrand-50/30'
                    } ${isBusy ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{optionLabel(option)}</p>
                      <p className="mt-1 text-sm text-slate-500">{option.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700">{option.fileName.split('.').pop()?.toUpperCase()}</p>
                      <p className="mt-1 text-sm text-slate-400">{option.totalBytes ? formatBytes(option.totalBytes) : 'Browser size'}</p>
                    </div>
                  </button>
                )
              })}

              <div className="mt-3 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={onDownload}
                  disabled={!selectedOption || state === 'resolving' || state === 'downloading'}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[1.3rem] bg-gradient-to-r from-sky-600 to-cyan-400 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <Download className="h-5 w-5" />
                  {state === 'success' ? 'Download Again' : 'Start Download'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.4rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Your media title, thumbnail, and available qualities will appear here after resolving the link.
            </div>
          )}
        </div>
      </div>

      {tasks.length ? (
        <div className="mt-6 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-skybrand-600">Download List</p>
              <h4 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900">Current and previous items</h4>
            </div>
            <p className="text-sm text-slate-500">{tasks.length} item{tasks.length === 1 ? '' : 's'}</p>
          </div>

          <div className="mt-5 grid gap-3">
            {tasks.map((item) => {
              const selected = item.id === task?.id
              const itemOption = item.result?.options.find((option) => option.id === item.selectedOptionId)

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTask(item.id)}
                  className={`flex w-full items-center gap-4 rounded-[1.4rem] border px-4 py-4 text-left transition ${
                    selected
                      ? 'border-sky-500 bg-skybrand-50/50'
                      : 'border-slate-100 bg-white hover:border-skybrand-200 hover:bg-skybrand-50/30'
                  }`}
                >
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-[1rem] bg-slate-100">
                    {item.result?.thumbnailUrl ? (
                      <img src={item.result.thumbnailUrl} alt={item.result.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <ImageOff className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-skybrand-600">{item.result?.sourceLabel ?? item.platformLabel}</p>
                    <p className="line-clamp-1 text-lg font-semibold text-slate-900">{item.result?.title ?? item.url}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {taskSummary(item.state, item.progress)}
                      {itemOption ? ` • ${itemOption.label}` : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700">{item.progress?.percent ?? 0}%</p>
                      <p className="text-xs text-slate-400">{progressMetaLabel(item.progress)}</p>
                    </div>
                    {item.state === 'downloading' && !item.progress?.status.toLowerCase().includes('browser') ? (
                      <span
                        onClick={(event) => {
                          event.stopPropagation()
                          onCancel(item.id)
                        }}
                        className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600"
                      >
                        Cancel
                      </span>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}
