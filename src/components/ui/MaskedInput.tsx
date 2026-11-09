import { IMaskInput } from 'react-imask'

interface MaskedInputProps {
  mask: string
  value: string
  onChange: (unmaskedValue: string) => void
  onBlur?: () => void
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
  name?: string
  id?: string
}

/** Input com máscara (CPF, celular) que expõe o valor sem formatação via onChange, para uso com react-hook-form Controller. */
export function MaskedInput({
  mask,
  value,
  onChange,
  onBlur,
  placeholder,
  invalid = false,
  disabled = false,
  name,
  id,
}: MaskedInputProps) {
  return (
    <IMaskInput
      mask={mask}
      unmask
      value={value}
      onAccept={(unmaskedValue: string) => onChange(unmaskedValue)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      name={name}
      id={id}
      className={[
        'h-[46px] rounded-control border px-3 text-[15px] text-ink-900 outline-none transition-colors',
        'placeholder:text-ink-400',
        disabled
          ? 'bg-surface-muted border-line-card text-ink-350 cursor-not-allowed'
          : invalid
            ? 'bg-danger-bg border-danger'
            : 'bg-white border-line-input focus:border-brand focus:ring-3 focus:ring-brand/10',
      ].join(' ')}
    />
  )
}
