import { Clipboard, Download, Link2, X } from 'lucide-react'
import { PlatformKey } from '../../types/downloader'
import { PlatformBadge } from './PlatformBadge'

type LinkInputCardProps = {
  url: string
  platform: PlatformKey
  platformLabel: string
  isValidUrl: boolean
  error?: string
  onChange: (value: string) => void
  onPaste: () => Promise<void>
  onClear: () => void
  onDownload: () => void
}

export function LinkInputCard({
  url,
  platform,
  platformLabel,
  isValidUrl,
  error,
  onChange,
  onPaste,
  onClear,
  onDownload,
}: LinkInputCardProps) {
  return (
    <section id="download-studio" className="section-shell p-5 sm:p-8">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-skybrand-600">Download Studio</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Paste your video link
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-slate-500">
            Drop any supported URL below and prepare it for download. The web app matches the same quick preset-based flow as the mobile app.
          </p>
        </div>

        <div className="rounded-[2rem] border border-skybrand-100 bg-skybrand-50/40 p-4 sm:p-5">
          <div className="flex flex-col gap-4 rounded-[1.7rem] border border-skybrand-200 bg-white px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                <Link2 className="h-5 w-5" />
              </span>
              <input
                value={url}
                onChange={(event) => onChange(event.target.value)}
                placeholder="https://example.com/video-link"
                className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              />
              {url ? (
                <button
                  type="button"
                  onClick={onClear}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white transition hover:bg-sky-600"
                >
                  <X className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPaste}
                  className="flex h-12 items-center gap-2 rounded-full bg-sky-50 px-4 font-semibold text-sky-700 transition hover:bg-sky-100"
                >
                  <Clipboard className="h-4 w-4" />
                  Paste
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <PlatformBadge platform={platform} label={platformLabel} />
              <p className="text-sm text-slate-500">Supports direct links, YouTube, and resolver-backed social video links.</p>
            </div>
          </div>
        </div>

        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</p> : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm text-slate-500">
            The downloader uses simple presets so users never need to parse raw stream formats or quality tables.
          </p>
          <button
            type="button"
            onClick={onDownload}
            disabled={!isValidUrl}
            className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
          >
            <Download className="h-5 w-5" />
            {isValidUrl ? 'Download Now' : 'Paste a Link First'}
          </button>
        </div>
      </div>
    </section>
  )
}
