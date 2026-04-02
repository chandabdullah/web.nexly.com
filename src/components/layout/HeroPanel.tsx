import { Bell, Download } from 'lucide-react'
import { BrandMark } from '../shared/BrandMark'

type HeroPanelProps = {
  appDownloadUrl: string
}

export function HeroPanel({ appDownloadUrl }: HeroPanelProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.75rem] bg-hero-wash px-6 py-8 text-white shadow-glow sm:px-8 sm:py-10 lg:px-10">
      <div className="hero-orb -left-24 top-8 h-56 w-56 bg-cyan-200/20" />
      <div className="hero-orb -right-10 -top-10 h-64 w-64 bg-white/15" />
      <div className="hero-orb -bottom-24 right-10 h-72 w-72 bg-sky-200/15" />
      <div className="relative flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <BrandMark compact />
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-300/15 text-white ring-1 ring-white/10">
            <Bell className="h-6 w-6" />
          </span>
        </div>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-100/90">Fast Share Saver</p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-tight sm:text-6xl">Nexly</h1>
          <p className="mt-4 max-w-xl text-lg text-cyan-50/90 sm:text-xl">
            Paste a link and save clips from YouTube, Instagram, TikTok, Facebook, X, and more in a cleaner, faster flow.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#download-studio"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-4 text-base font-semibold text-sky-700 transition hover:-translate-y-0.5"
          >
            Open Downloader
          </a>
          <a
            href={appDownloadUrl}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/15"
          >
            <Download className="h-5 w-5" />
            Download App
          </a>
        </div>
      </div>
    </section>
  )
}
