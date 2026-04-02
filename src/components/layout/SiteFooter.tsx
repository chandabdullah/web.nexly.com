import { Facebook, Github, Instagram, Twitter } from 'lucide-react'
import { BrandMark } from '../shared/BrandMark'

const quickLinks = ['How to Use', 'Key Features', 'Help Center', 'Privacy Policy']
const companyLinks = ['About Nexly', 'Contact', 'Terms of Service', 'DMCA']

export function SiteFooter() {
  return (
    <footer className="overflow-hidden rounded-[2.75rem] border border-skybrand-100 bg-white px-6 py-10 text-slate-600 shadow-card sm:px-8 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.65fr_0.65fr]">
        <div>
          <BrandMark compact />
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-500">
            Nexly is a modern multi-source video downloader interface built for a fast paste-to-download workflow, clear preset
            quality choices, and a cleaner branded experience across web and app.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {[Facebook, Twitter, Instagram, Github].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-slate-500 transition hover:bg-sky-100"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Quick Links</h3>
          <div className="mt-4 space-y-3">
            {quickLinks.map((link) => (
              <a key={link} href="#" className="block text-base text-slate-500 transition hover:text-sky-600">
                {link}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Company</h3>
          <div className="mt-4 space-y-3">
            {companyLinks.map((link) => (
              <a key={link} href="#" className="block text-base text-slate-500 transition hover:text-sky-600">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-skybrand-100 pt-6 text-sm text-slate-500">
        <p>© 2026 Nexly. Built for personal media saving workflows with backend-assisted resolution and download delivery.</p>
      </div>
    </footer>
  )
}
