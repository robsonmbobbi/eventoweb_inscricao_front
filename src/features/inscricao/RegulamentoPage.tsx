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
    <div className="flex h-dvh flex-col bg-surface-page">
      <Header variant="back" title="Regulamento" onBack={() => navigate('/eventos')} />
      <main className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-4 md:gap-5 md:px-10 md:py-6">
        {evento && (
          <h2 className="shrink-0 text-[20px] font-bold text-ink-900 md:text-[24px]">
            {evento.nome}
          </h2>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto rounded-section border border-line-card bg-surface-card p-4 md:p-8">
          {evento?.regulamento ? (
            <div
              className={[
                'max-w-3xl text-[15px] leading-relaxed text-ink-700 md:text-[16px]',
                '[&_p]:mb-3 [&_li]:mb-1 [&_strong]:text-ink-900',
                '[&_h1,&_h2,&_h3]:mt-5 [&_h1,&_h2,&_h3]:mb-2 [&_h1,&_h2,&_h3]:font-bold [&_h1,&_h2,&_h3]:text-ink-900',
                '[&_h1]:text-[20px] [&_h2]:text-[18px] [&_h3]:text-[16px] [&>*:first-child]:mt-0',
                '[&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:mb-3 [&_ul,&_ol]:pl-5',
              ].join(' ')}
              dangerouslySetInnerHTML={{ __html: evento.regulamento }}
            />
          ) : (
            <p className="text-[14px] text-ink-500">Carregando regulamento…</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex items-start gap-3 md:items-center">
            <input
              type="checkbox"
              checked={aceito}
              onChange={(e) => setAceito(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded-[6px] border-2 border-line-input accent-[var(--color-brand)] md:mt-0"
            />
            <span className="text-[15px] font-medium text-ink-700">
              Li e aceito o regulamento do evento
            </span>
          </label>

          <div className="flex flex-col gap-3 md:flex-row-reverse md:items-center md:gap-6">
            <Button
              onClick={continuar}
              disabled={!aceito}
              className="w-full md:w-auto md:min-w-[180px]"
            >
              Continuar
            </Button>
            <button
              type="button"
              onClick={() => navigate('/eventos')}
              className="text-center text-[14px] font-semibold text-brand"
            >
              Voltar
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
