import { Menu, Moon, Sun } from 'lucide-react'
import { BrandMark } from '../shared/BrandMark'

type TopNavProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
]

export function TopNav({ theme, onToggleTheme }: TopNavProps) {
  return (
    <header className="sticky top-4 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/65 bg-white/58 px-5 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.06)] backdrop-blur-2xl sm:px-6 lg:px-7">
        <a href="#home" className="shrink-0">
          <BrandMark compact />
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base font-semibold text-slate-600 transition hover:text-sky-600"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/72 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-white sm:inline-flex"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/65 text-slate-500 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
