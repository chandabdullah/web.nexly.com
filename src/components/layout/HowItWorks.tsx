import { Copy, Download, WandSparkles } from 'lucide-react'

const steps = [
  {
    icon: Copy,
    title: 'Copy the link',
    text: 'Grab the public post or video URL from YouTube, Facebook, Instagram, TikTok, X, Pinterest, or a direct media page.',
    tone: 'from-violet-500 to-indigo-500',
  },
  {
    icon: WandSparkles,
    title: 'Paste and pick a preset',
    text: 'Drop the URL into Nexly and choose High, Medium, Low, or Audio. The app maps your choice to the best real option.',
    tone: 'from-sky-500 to-cyan-400',
  },
  {
    icon: Download,
    title: 'Download instantly',
    text: 'Nexly resolves the stream, starts the download, and keeps progress and result states clear throughout the flow.',
    tone: 'from-fuchsia-500 to-pink-500',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-skybrand-600">How It Works</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Three quick steps from copied link to saved file
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-500">
          Paste a public social video link, let Nexly detect the source, then save the file in the format you need.
        </p>
      </div>
      <div className="relative mt-12 grid gap-8 lg:grid-cols-3">
        {steps.map(({ icon: Icon, title, text, tone }) => (
          <article
            key={title}
            className="relative rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
          >
            <span
              className={`flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-gradient-to-br ${tone} text-white shadow-lg`}
            >
              <Icon className="h-8 w-8" />
            </span>
            <h3 className="mt-8 font-display text-3xl font-bold tracking-tight text-slate-900">{title}</h3>
            <p className="mt-4 text-lg leading-8 text-slate-500">{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
