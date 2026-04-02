import { ArrowRight, Download } from 'lucide-react'

type AppDownloadBannerProps = {
  appDownloadUrl: string
}

export function AppDownloadBanner({ appDownloadUrl }: AppDownloadBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.75rem] bg-[linear-gradient(135deg,#0f75cc_0%,#18c2e2_100%)] px-6 py-8 text-white shadow-glow sm:px-8 sm:py-10">
      <div className="hero-orb -left-20 top-0 h-60 w-60 bg-white/12" />
      <div className="hero-orb -right-16 bottom-0 h-64 w-64 bg-cyan-100/18" />
      <div className="absolute inset-0 hidden lg:block">
        <div className="absolute left-[8%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-white/15" />
        <div className="absolute left-[12%] top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border border-white/15" />
      </div>
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Mobile App</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Want the native share-sheet flow?</h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Install the app for the fastest handoff from copied links and shared posts. The web version mirrors the flow, and the app keeps the native experience one tap away.
          </p>
        </div>
        <a
          href={appDownloadUrl}
          className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-lg font-semibold text-slate-950 transition hover:-translate-y-0.5"
        >
          <Download className="h-5 w-5" />
          Download App
          <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </section>
  )
}
