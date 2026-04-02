import nexlyIcon from '../../../assets/nexly.png'

type BrandMarkProps = {
  compact?: boolean
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div
      className={`inline-flex items-center rounded-[1.8rem] ${
        compact ? 'gap-3 px-0 py-0' : 'gap-4 px-0 py-0'
      }`}
    >
      <span
        className={`overflow-hidden rounded-[1.45rem] shadow-[0_18px_38px_rgba(17,184,231,0.22)] ring-1 ring-sky-100/80 ${
          compact ? 'h-12 w-12' : 'h-16 w-16'
        }`}
      >
        <img src={nexlyIcon} alt="Nexly" className="h-full w-full object-cover" />
      </span>
      <span className={`font-display font-bold tracking-tight ${compact ? 'text-[1.65rem] text-sky-700' : 'text-3xl text-white'}`}>
        Nexly
      </span>
    </div>
  )
}
