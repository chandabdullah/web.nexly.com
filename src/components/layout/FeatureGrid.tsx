import { Download, Link2, Music4, ShieldCheck } from 'lucide-react'

const platforms = [
  {
    name: 'YouTube',
    badge: 'YT',
    badgeClass:
      'bg-[linear-gradient(135deg,#ff4d4d_0%,#e11d48_100%)] text-white shadow-[0_18px_40px_rgba(225,29,72,0.28)]',
  },
  {
    name: 'Instagram',
    badge: 'IG',
    badgeClass:
      'bg-[linear-gradient(135deg,#feda75_0%,#fa7e1e_26%,#d62976_58%,#962fbf_80%,#4f5bd5_100%)] text-white shadow-[0_18px_40px_rgba(214,41,118,0.28)]',
  },
  {
    name: 'TikTok',
    badge: 'TT',
    badgeClass:
      'bg-[linear-gradient(135deg,#0f172a_0%,#111827_100%)] text-white shadow-[0_18px_40px_rgba(15,23,42,0.28)]',
  },
  {
    name: 'Facebook',
    badge: 'FB',
    badgeClass:
      'bg-[linear-gradient(135deg,#60a5fa_0%,#2563eb_100%)] text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)]',
  },
  {
    name: 'X / Twitter',
    badge: 'X',
    badgeClass:
      'bg-[linear-gradient(135deg,#111827_0%,#334155_100%)] text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)]',
  },
]

const quickPoints = [
  {
    icon: Link2,
    title: 'Paste one public link',
    text: 'No messy forms. Just drop the post or video URL and start.',
  },
  {
    icon: Download,
    title: 'Choose video or audio',
    text: 'Keep the flow simple with clear presets users understand.',
  },
  {
    icon: Music4,
    title: 'Fast download flow',
    text: 'Detect, resolve, and save without sending users through extra steps.',
  },
  {
    icon: ShieldCheck,
    title: 'Clear status feedback',
    text: 'Show progress, success, and errors in a clean way.',
  },
]

export function FeatureGrid() {
  return (
    <section id="features" className="relative overflow-hidden px-2 py-10 sm:px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-6 top-10 h-64 w-64 rounded-full bg-cyan-100/50 blur-3xl" />
        <div className="absolute right-6 top-16 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-skybrand-600">Supported Platforms</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Download videos from the apps people actually use
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-500">
            Paste a public link from popular social platforms and let Nexly handle the download flow in one clean screen.
          </p>
        </div>

        <div className="mt-12 rounded-[2.5rem] border border-white/60 bg-white/60 p-5 shadow-[0_30px_80px_rgba(59,130,246,0.12)] backdrop-blur-xl sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {platforms.map(({ name, badge, badgeClass }) => (
              <article
                key={name}
                className="group rounded-[1.8rem] border border-sky-100/80 bg-white px-5 py-6 text-center shadow-[0_18px_48px_rgba(148,163,184,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(59,130,246,0.18)]"
              >
                <span
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[1.35rem] text-lg font-bold tracking-wide ${badgeClass}`}
                >
                  {badge}
                </span>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900">{name}</h3>
                <p className="mt-2 text-sm font-medium text-slate-400">Public video link supported</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickPoints.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-[1.6rem] border border-sky-100/70 bg-white/85 px-5 py-5 text-left shadow-[0_14px_36px_rgba(148,163,184,0.1)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-skybrand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h4 className="mt-4 text-lg font-bold tracking-tight text-slate-900">{title}</h4>
                <p className="mt-2 text-sm leading-7 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
