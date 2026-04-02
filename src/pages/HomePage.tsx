import { useEffect, useState } from 'react'
import { FeatureGrid } from '../components/layout/FeatureGrid'
import { HeroDownloader } from '../components/layout/HeroDownloader'
import { ProgressPanel } from '../components/downloader/ProgressPanel'
import { TopNav } from '../components/layout/TopNav'
import { HowItWorks } from '../components/layout/HowItWorks'
import { GuideSection } from '../components/layout/GuideSection'
import { FaqSection } from '../components/layout/FaqSection'
import { SiteFooter } from '../components/layout/SiteFooter'
import { useDownloader } from '../hooks/useDownloader'

export function HomePage() {
  const { composer, activeTask, tasks, actions } = useDownloader()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const heroError = activeTask?.result ? undefined : composer.error

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#f3f8fe_45%,#f9fcff_100%)] bg-no-repeat">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-3 py-5 sm:px-4 sm:py-8 lg:px-5">
        <TopNav theme={theme} onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))} />
        <HeroDownloader
          url={composer.url}
          platform={composer.platform}
          platformLabel={composer.platformLabel}
          isValidUrl={composer.isValidUrl}
          error={heroError}
          onChange={actions.updateUrl}
          onPaste={actions.pasteFromClipboard}
          onDownload={actions.openPreset}
        />
        <ProgressPanel
          task={activeTask}
          tasks={tasks}
          onSelectTask={actions.selectTask}
          onSelectOption={actions.selectOption}
          onDownload={actions.startSelectedDownload}
          onCancel={actions.cancelDownload}
        />
        <FeatureGrid />
        <HowItWorks />
        <GuideSection />
        <FaqSection />
        <SiteFooter />
      </div>
    </main>
  )
}
