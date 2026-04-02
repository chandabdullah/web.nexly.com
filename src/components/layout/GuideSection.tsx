const guides = [
  {
    index: '01',
    title: 'Paste a supported public URL',
    text: 'Use the original public link from the source app or website. Shared tokens and private in-app URLs will usually fail.',
  },
  {
    index: '02',
    title: 'Choose a simple preset',
    text: 'High video, Medium video, Low video, or Audio. The product stays simple while the backend handles stream selection.',
  },
  {
    index: '03',
    title: 'Download in the browser or install the app',
    text: 'Use the web version for fast direct downloads, or install the app to keep a more native share-style workflow.',
  },
]

export function GuideSection() {
  return (
    <section className="relative overflow-hidden py-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-skybrand-600">Guide</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Use the right kind of link for the fastest download
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-500">
            Nexly works best with public post and video URLs from supported platforms. Keep the flow simple: paste the original link,
            pick the quality you want, and save the file.
          </p>
        </div>
        <div className="space-y-4">
          {guides.map((guide) => (
            <article
              key={guide.index}
              className="rounded-[1.8rem] border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                  {guide.index}
                </span>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">{guide.title}</h3>
                  <p className="mt-3 text-base leading-8 text-slate-500">{guide.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
