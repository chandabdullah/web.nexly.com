import { Clipboard, Link2, Lock, MonitorSmartphone, Zap } from 'lucide-react'
import { PlatformKey } from '../../types/downloader'
import { PlatformBadge } from '../downloader/PlatformBadge'

type HeroDownloaderProps = {
  url: string
  platform: PlatformKey
  platformLabel: string
  isValidUrl: boolean
  error?: string
  onChange: (value: string) => void
  onPaste: () => Promise<void>
  onDownload: () => void
}

export function HeroDownloader({
  url,
  platform,
  platformLabel,
  isValidUrl,
  error,
  onChange,
  onPaste,
  onDownload,
}: HeroDownloaderProps) {
  return (
    <section id="home" className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
      <div className="relative mx-auto max-w-6xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.45em] text-skybrand-600">Fast Video Downloader</p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
          Download videos from any URL
          <span className="block bg-gradient-to-r from-sky-600 to-cyan-400 bg-clip-text text-transparent">
            in Nexly quality
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-500 sm:text-xl">
          Fast, clean, and preset-based. Paste a supported link, let Nexly detect the source, then download without digging
          through raw formats and messy stream options.
        </p>

        <div className="mx-auto mt-10 max-w-5xl">
          <div className="flex flex-col gap-3 rounded-[2rem] bg-white/78 p-4 shadow-[0_24px_60px_rgba(59,130,246,0.12)] backdrop-blur-xl lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.4rem] bg-white px-4 py-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-slate-400">
                <Link2 className="h-6 w-6" />
              </span>
              <input
                value={url}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Paste video link here..."
                className="min-w-0 flex-1 bg-transparent text-lg text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              onClick={onDownload}
              disabled={!isValidUrl}
              className="inline-flex items-center justify-center rounded-[1.3rem] bg-gradient-to-r from-sky-600 to-cyan-400 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 lg:min-w-[12.5rem]"
            >
              Download
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          <span className="inline-flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-500" />
            Secure & Private
          </span>
          <span className="inline-flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Fast Resolution
          </span>
          <span className="inline-flex items-center gap-2">
            <MonitorSmartphone className="h-4 w-4 text-sky-500" />
            Web + App Flow
          </span>
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center gap-4">
          <button
            type="button"
            onClick={onPaste}
            className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-5 py-3 font-semibold text-sky-700 transition hover:bg-sky-100"
          >
            <Clipboard className="h-4 w-4" />
            Paste from clipboard
          </button>
          <PlatformBadge platform={platform} label={platformLabel} />
          <p className="max-w-2xl text-sm text-slate-500">
            Supports direct links, YouTube, and resolver-backed social video links.
          </p>
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</p> : null}
        </div>
      </div>
    </section>
  )
}
