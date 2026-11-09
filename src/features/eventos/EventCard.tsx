import type { DTOEvento } from '../../types/dtos'
import { formatDateRange } from '../../lib/date'
import { Button } from '../../components/ui/Button'

interface EventCardProps {
  evento: DTOEvento
  onInscrever: () => void
}

export function EventCard({ evento, onInscrever }: EventCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-line-card bg-white shadow-card">
      <div className="aspect-[210/297] bg-surface-subtle">
        {evento.logotipo ? (
          <img
            src={`data:image/png;base64,${evento.logotipo}`}
            alt={`Cartaz de ${evento.nome}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[11px] text-ink-400">
            Sem cartaz
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 p-4">
        <h3 className="min-h-11 text-[17px] font-bold text-ink-900">{evento.nome}</h3>
        <div className="flex flex-col gap-1.5 text-[13px]">
          <div className="flex gap-2">
            <span className="min-w-[72px] text-ink-400">Inscrições</span>
            <span className="text-ink-700">
              {formatDateRange(evento.dataInicialInscricao, evento.dataFinalInscricao)}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="min-w-[72px] text-ink-400">Realização</span>
            <span className="text-ink-700">
              {formatDateRange(evento.dataInicialRealizacao, evento.dataFinalRealizacao)}
            </span>
          </div>
        </div>
        <Button onClick={onInscrever} fullWidth className="h-11">
          Inscrever-se
        </Button>
      </div>
    </div>
  )
}
