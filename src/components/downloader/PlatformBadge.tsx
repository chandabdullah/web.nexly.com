import { Globe, Instagram, Music2, PinIcon, PlayCircle, Radio, Video } from 'lucide-react'
import { PlatformKey } from '../../types/downloader'

type PlatformBadgeProps = {
  platform: PlatformKey
  label: string
}

const badgeMap: Record<PlatformKey, { icon: typeof Globe; className: string }> = {
  youtube: { icon: PlayCircle, className: 'bg-red-50 text-red-500 ring-red-100' },
  instagram: { icon: Instagram, className: 'bg-pink-50 text-pink-500 ring-pink-100' },
  facebook: { icon: Video, className: 'bg-blue-50 text-blue-500 ring-blue-100' },
  tiktok: { icon: Music2, className: 'bg-slate-50 text-slate-900 ring-slate-200' },
  x: { icon: Radio, className: 'bg-slate-50 text-slate-800 ring-slate-200' },
  pinterest: { icon: PinIcon, className: 'bg-rose-50 text-rose-500 ring-rose-100' },
  generic: { icon: Globe, className: 'bg-cyan-50 text-cyan-600 ring-cyan-100' },
  unknown: { icon: Globe, className: 'bg-slate-50 text-slate-500 ring-slate-200' },
}

export function PlatformBadge({ platform, label }: PlatformBadgeProps) {
  const current = badgeMap[platform]
  const Icon = current.icon

  return (
    <div className={`inline-flex items-center gap-3 rounded-[1.4rem] px-4 py-3 ring-1 ${current.className}`}>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Detected</p>
        <p className="text-lg font-semibold">{label}</p>
      </div>
    </div>
  )
}
