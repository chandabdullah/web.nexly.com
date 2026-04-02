import { ChevronDown } from 'lucide-react'

const items = [
  {
    question: 'Which platforms does Nexly support?',
    answer:
      'Nexly is designed for YouTube, Facebook, Instagram, TikTok, X, Pinterest, and direct media URLs. Actual support depends on the backend resolver you connect.',
  },
  {
    question: 'Why is a backend required for the web version?',
    answer:
      'Reliable browser downloads need resolver and delivery APIs because third-party media sources often use CORS restrictions, expiring URLs, or anti-bot protections.',
  },
  {
    question: 'Can users pick exact stream formats manually?',
    answer:
      'The main product flow stays preset-first. Users choose High, Medium, Low, or Audio, and Nexly maps that to the best matching real option.',
  },
  {
    question: 'Where does the downloaded file go?',
    answer:
      'In most browsers the file is saved to the default downloads folder, unless the browser asks the user where to save it first.',
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="relative overflow-hidden px-2 py-10 sm:px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-8 top-8 h-52 w-52 rounded-full bg-cyan-100/60 blur-3xl" />
        <div className="absolute right-8 top-24 h-64 w-64 rounded-full bg-sky-100/70 blur-3xl" />
      </div>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-skybrand-600">FAQ</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Common questions about the web downloader
        </h2>
      </div>
      <div className="relative mx-auto mt-12 max-w-4xl space-y-4">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-[1.7rem] bg-white/78 px-6 py-5 shadow-[0_16px_45px_rgba(59,130,246,0.12)] backdrop-blur-xl"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-xl font-bold text-slate-900">
              {item.question}
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" />
            </summary>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
