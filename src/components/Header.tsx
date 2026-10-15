import type { ReactNode } from 'react'

interface BrandHeaderProps {
  variant: 'brand'
  subtitle?: string
}

interface BackHeaderProps {
  variant: 'back'
  title: string
  onBack: () => void
  badge?: ReactNode
}

interface CenteredHeaderProps {
  variant: 'centered'
  title: string
}

type HeaderProps = BrandHeaderProps | BackHeaderProps | CenteredHeaderProps

export function Header(props: HeaderProps) {
  if (props.variant === 'brand') {
    return (
      <div className="flex items-center justify-between border-b border-line-divider bg-white px-5 py-4 md:px-10">
        <Logo />
        {props.subtitle && (
          <span className="hidden text-[14px] font-medium text-ink-500 md:inline">
            {props.subtitle}
          </span>
        )}
      </div>
    )
  }

  if (props.variant === 'back') {
    return (
      <div className="flex items-center justify-between border-b border-line-divider bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={props.onBack}
            aria-label="Voltar"
            className="text-[22px] text-ink-700"
          >
            ‹
          </button>
          <span className="text-[15px] font-semibold text-ink-900">{props.title}</span>
        </div>
        {props.badge}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center border-b border-line-divider bg-white px-5 py-4">
      <span className="text-[15px] font-semibold text-ink-900">{props.title}</span>
    </div>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-7 w-7 rounded-[8px] bg-brand md:h-[30px] md:w-[30px] md:rounded-[9px]" />
      <span className="text-[17px] font-bold text-ink-900 md:text-[18px]">EventoWeb</span>
    </div>
  )
}
