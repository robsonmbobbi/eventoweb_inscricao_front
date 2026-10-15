import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { obterEvento } from '../../api/eventos'
import { Header } from '../../components/Header'
import { Button } from '../../components/ui/Button'
import { useWizardStore } from '../../store/useWizardStore'

export function RegulamentoPage() {
  const { idEvento } = useParams()
  const navigate = useNavigate()
  const aceitarRegulamento = useWizardStore((state) => state.aceitarRegulamento)
  const [aceito, setAceito] = useState(false)

  const { data: evento } = useQuery({
    queryKey: ['evento', idEvento],
    queryFn: () => obterEvento(Number(idEvento)),
  })

  function continuar() {
    aceitarRegulamento()
    navigate(`/eventos/${idEvento}/cpf`)
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <Header variant="back" title="Regulamento" onBack={() => navigate('/eventos')} />
      <main className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-6">
        {evento && (
          <div className="flex flex-col gap-1">
            <h2 className="text-[20px] font-bold text-ink-900">{evento.nome}</h2>
          </div>
        )}

        <div className="relative max-h-[420px] overflow-y-auto rounded-section border border-line-card bg-surface-subtle p-4.5">
          {evento?.regulamento ? (
            <div
              className="prose prose-sm max-w-none text-ink-700 [&_p]:mb-3 [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: evento.regulamento }}
            />
          ) : (
            <p className="text-[14px] text-ink-500">Carregando regulamento…</p>
          )}
        </div>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={aceito}
            onChange={(e) => setAceito(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded-[6px] border-2 border-line-input accent-[var(--color-brand)]"
          />
          <span className="text-[15px] font-medium text-ink-700">
            Li e aceito o regulamento do evento
          </span>
        </label>

        <Button onClick={continuar} disabled={!aceito} fullWidth>
          Continuar
        </Button>
        <button
          type="button"
          onClick={() => navigate('/eventos')}
          className="text-center text-[14px] font-semibold text-brand"
        >
          Voltar
        </button>
      </main>
    </div>
  )
}
