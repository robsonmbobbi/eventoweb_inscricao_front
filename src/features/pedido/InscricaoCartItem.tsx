import type { DTOInscricao } from '../../types/dtos'
import { TipoInscricao } from '../../types/enums'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../lib/currency'

interface InscricaoCartItemProps {
  inscricao: DTOInscricao
  valor: number | null
  mostrarValor: boolean
}

export function InscricaoCartItem({ inscricao, valor, mostrarValor }: InscricaoCartItemProps) {
  return (
    <div className="flex items-center gap-3 border-b border-line-divider px-4 py-3.5 last:border-b-0">
      <span className="h-2 w-2 flex-none rounded-full bg-success" />
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-[15px] font-semibold text-ink-900">{inscricao.pessoa.nome}</span>
        <Badge variant={inscricao.tipo === TipoInscricao.Adulto ? 'adulto' : 'infantil'}>
          {inscricao.tipo === TipoInscricao.Adulto ? 'Adulto' : 'Infantil'}
        </Badge>
      </div>
      {mostrarValor && (
        <span className="text-[15px] font-bold text-ink-900">
          {valor != null ? formatCurrency(valor) : '—'}
        </span>
      )}
    </div>
  )
}
