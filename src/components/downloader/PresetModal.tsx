import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, Music4, Video } from 'lucide-react'
import { PresetKey } from '../../types/downloader'

type PresetModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (preset: PresetKey) => void
}

const presets: Array<{
  key: PresetKey
  label: string
  caption: string
  type: 'video' | 'audio'
}> = [
  { key: 'high-video', label: 'High', caption: 'Best available quality', type: 'video' },
  { key: 'medium-video', label: 'Medium', caption: 'Balanced quality', type: 'video' },
  { key: 'low-video', label: 'Low', caption: 'Smaller file size', type: 'video' },
  { key: 'audio', label: 'Audio', caption: 'Best audio-only stream', type: 'audio' },
]

export function PresetModal({ isOpen, onClose, onSelect }: PresetModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('high-video')

  useEffect(() => {
    if (isOpen) {
      setSelectedPreset('high-video')
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-2xl rounded-[2.25rem] bg-white p-6 shadow-2xl shadow-slate-900/20 sm:p-8">
        <div className="mx-auto mb-6 h-1.5 w-20 rounded-full bg-sky-100" />
        <div className="rounded-[1.8rem] border border-skybrand-200 bg-skybrand-50/40 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-sky-500 to-cyan-400 text-white">
              <Video className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-display text-[2.4rem] font-bold tracking-tight text-slate-900">Nexly</h3>
              <p className="text-base text-slate-500">Instant preset mode</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-2 gap-3 rounded-[1.7rem] border border-skybrand-200 bg-skybrand-50/50 p-2">
            <div className="rounded-[1.25rem] bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3.5 text-center text-lg font-semibold text-white">
              Video
            </div>
            <div className="rounded-[1.25rem] px-4 py-3.5 text-center text-lg font-semibold text-slate-700">Audio</div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {presets.map((preset) => {
            const isAudio = preset.type === 'audio'

            return (
              <button
                key={preset.key}
                type="button"
                onClick={() => setSelectedPreset(preset.key)}
                className={`flex w-full items-center justify-between rounded-[1.7rem] border px-5 py-5 text-left transition ${
                  selectedPreset === preset.key
                    ? 'border-sky-500 bg-skybrand-50/60 shadow-lg shadow-sky-100'
                    : 'border-skybrand-200 hover:border-sky-400 hover:bg-skybrand-50/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      isAudio ? 'bg-cyan-50 text-cyan-600' : 'bg-sky-50 text-sky-600'
                    }`}
                  >
                    {isAudio ? <Music4 className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </span>
                  <div>
                    <p className="text-[2.05rem] font-bold tracking-tight text-slate-900">{preset.label}</p>
                    <p className="text-base text-slate-500">{preset.caption}</p>
                  </div>
                </div>
                {selectedPreset === preset.key ? (
                  <CheckCircle2 className="h-6 w-6 text-sky-500" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-400" />
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-skybrand-200 px-6 py-4 text-base font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSelect(selectedPreset)}
            className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5"
          >
            Download Selected
          </button>
        </div>
      </div>
    </div>
  )
}
