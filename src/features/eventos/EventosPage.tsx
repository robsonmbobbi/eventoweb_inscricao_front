import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { listarEventos } from '../../api/eventos'
import { Header } from '../../components/Header'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { EventCardSkeleton } from '../../components/ui/Skeleton'
import { usePedidoStore } from '../../store/usePedidoStore'
import { useWizardStore } from '../../store/useWizardStore'
import { EventCard } from './EventCard'

export function EventosPage() {
  const navigate = useNavigate()
  const resetWizard = useWizardStore((state) => state.reset)
  const limparPedido = usePedidoStore((state) => state.limpar)

  const { data: eventos, isLoading, isError, refetch } = useQuery({
    queryKey: ['eventos'],
    queryFn: listarEventos,
  })

  function iniciarInscricao(idEvento: number) {
    resetWizard()
    limparPedido()
    navigate(`/eventos/${idEvento}/regulamento`)
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <Header variant="brand" />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-9 md:px-10">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[22px] font-bold text-ink-900 md:text-[30px]">
            Eventos disponíveis
          </h1>
          {!isLoading && !isError && (
            <span className="text-[14px] text-ink-500">
              {eventos && eventos.length > 0
                ? `${eventos.length} evento${eventos.length > 1 ? 's' : ''} com inscrições abertas`
                : undefined}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-start gap-3">
            <Alert variant="error">Não foi possível carregar os eventos disponíveis.</Alert>
            <Button variant="secondary" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        )}

        {!isLoading && !isError && eventos && eventos.length === 0 && (
          <EmptyState
            title="Não há eventos disponíveis no momento"
            description="Assim que um novo evento abrir inscrições, ele aparecerá aqui. Volte mais tarde."
          />
        )}

        {!isLoading && !isError && eventos && eventos.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {eventos.map((evento) => (
              <EventCard
                key={evento.id}
                evento={evento}
                onInscrever={() => iniciarInscricao(evento.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
