import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { CopyField } from '../../components/ui/CopyField'
import { formatCurrency } from '../../lib/currency'
import { StatusTransacao, TipoPagamento, TipoPedido } from '../../types/enums'
import type { DTOResultadoPedido } from '../../types/dtos'

interface ResultadoLocationState {
  resultado: DTOResultadoPedido
  quantidadeInscricoes?: number
  emailPagador?: string
  celularPagador?: string
  numeroParcelas?: number
}

const STATUS_LABEL: Record<number, string> = {
  [StatusTransacao.Pendente]: 'Aguardando pagamento',
  [StatusTransacao.Recebida]: 'Pagamento recebido',
  [StatusTransacao.Cancelada]: 'Pagamento cancelado',
}

const STATUS_BADGE: Record<number, 'aviso' | 'sucesso' | 'neutro'> = {
  [StatusTransacao.Pendente]: 'aviso',
  [StatusTransacao.Recebida]: 'sucesso',
  [StatusTransacao.Cancelada]: 'neutro',
}

export function ResultadoPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ResultadoLocationState | null

  useEffect(() => {
    if (!state?.resultado) navigate('/eventos', { replace: true })
  }, [state, navigate])

  if (!state?.resultado) return null
  const { resultado, quantidadeInscricoes, emailPagador, celularPagador, numeroParcelas } = state

  function concluir() {
    navigate('/eventos')
  }

  if (resultado.tipo === TipoPedido.Debito && resultado.debito) {
    const { debito } = resultado
    const isPix = debito.tipoTransacao === TipoPagamento.Pix
    const cartaoAprovado = !isPix && debito.status === StatusTransacao.Recebida
    const cartaoRecusado = !isPix && debito.status === StatusTransacao.Cancelada
    // O back só envia o link como fallback quando a cobrança no cartão não foi aprovada na hora.
    const linkPagamento = !isPix && !cartaoAprovado && !cartaoRecusado ? debito.linkPagamento : null
    const parcelamento =
      numeroParcelas && numeroParcelas > 1
        ? ` em ${numeroParcelas}x de ${formatCurrency(resultado.valor / numeroParcelas)}`
        : ''

    let titulo: string
    let descricao: string
    if (isPix) {
      titulo = 'Escaneie o QR code para pagar'
      descricao = `${formatCurrency(resultado.valor)} · a confirmação chega em poucos segundos após o pagamento.`
    } else if (cartaoAprovado) {
      titulo = 'Pagamento confirmado'
      descricao = `O pagamento de ${formatCurrency(resultado.valor)}${parcelamento} no cartão de crédito foi aprovado.`
    } else if (cartaoRecusado) {
      titulo = 'Pagamento não aprovado'
      descricao = 'A cobrança no cartão não foi aprovada. Entre em contato com a coordenação do evento.'
    } else if (linkPagamento) {
      titulo = 'Seu link de pagamento está pronto'
      descricao = `Abra o link para pagar ${formatCurrency(resultado.valor)} com cartão de crédito.`
    } else {
      titulo = 'Pagamento em processamento'
      descricao = `O pagamento de ${formatCurrency(resultado.valor)}${parcelamento} está sendo processado pela operadora do cartão.`
    }

    return (
      <div className="min-h-screen bg-surface-page">
        <Header variant="centered" title={isPix ? 'Pagamento via Pix' : 'Pagamento por cartão'} />
        <main className="mx-auto flex max-w-lg flex-col items-center gap-5 px-5 py-7 text-center">
          {!isPix && (
            <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-brand-border bg-brand-tint">
              <div className="h-5 w-7 rounded-[4px] border-2 border-brand" />
            </div>
          )}

          <Badge variant={STATUS_BADGE[debito.status]}>
            {cartaoAprovado
              ? 'Pagamento aprovado'
              : cartaoRecusado
                ? 'Pagamento recusado'
                : !isPix && !linkPagamento
                  ? 'Em processamento'
                  : STATUS_LABEL[debito.status]}
          </Badge>

          <div className="flex flex-col gap-2">
            <h3 className="text-[22px] font-bold text-ink-900">{titulo}</h3>
            <p className="text-[14px] leading-relaxed text-ink-500">{descricao}</p>
          </div>

          {isPix && debito.imagemQRCodePixBase64 && (
            <img
              src={`data:image/png;base64,${debito.imagemQRCodePixBase64}`}
              alt="QR code para pagamento via Pix"
              className="h-[230px] w-[230px] rounded-card border border-line-card bg-white p-3.5"
            />
          )}

          {isPix && debito.pixCopiaECola && (
            <CopyField label="Pix copia e cola" value={debito.pixCopiaECola} />
          )}

          {linkPagamento && (
            <>
              <CopyField label="Link de pagamento" value={linkPagamento} copyLabel="Copiar link" />
              <Button
                variant="secondary"
                fullWidth
                onClick={() => window.open(linkPagamento, '_blank', 'noopener,noreferrer')}
              >
                Abrir link de pagamento
              </Button>
            </>
          )}

          <div className="flex w-full flex-col gap-2 rounded-section border border-line-divider bg-surface-subtle p-3.5 text-left">
            <InfoRow label="Pedido" value={`#${resultado.idPedido}`} />
            {quantidadeInscricoes != null && (
              <InfoRow
                label="Inscrições"
                value={`${quantidadeInscricoes} pessoa${quantidadeInscricoes > 1 ? 's' : ''}`}
              />
            )}
            {!isPix && <InfoRow label="Forma de pagamento" value="Cartão de crédito" />}
            {!isPix && cartaoAprovado && (
              <InfoRow
                label="Parcelamento"
                value={
                  numeroParcelas && numeroParcelas > 1
                    ? `${numeroParcelas}x de ${formatCurrency(resultado.valor / numeroParcelas)}`
                    : 'À vista'
                }
              />
            )}
            <InfoRow label="Valor" value={formatCurrency(resultado.valor)} />
            {!isPix && emailPagador && <InfoRow label="Contato" value={emailPagador} />}
            {!isPix && celularPagador && <InfoRow label="WhatsApp" value={celularPagador} />}
          </div>

          <Button onClick={concluir} fullWidth>
            Concluir
          </Button>
        </main>
      </div>
    )
  }

  const isDesconto = resultado.tipo === TipoPedido.Desconto

  return (
    <div className="min-h-screen bg-surface-page">
      <Header variant="centered" title="Solicitação registrada" />
      <main className="mx-auto flex max-w-lg flex-col items-center gap-5 px-6 py-9 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-brand-border bg-brand-tint">
          <div className="relative h-[52px] w-[52px] rounded-full border-[3px] border-brand" />
        </div>
        <Badge variant="adulto">Em análise</Badge>
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[23px] font-bold text-ink-900">
            Pedido de {isDesconto ? 'desconto' : 'isenção'} enviado
          </h3>
          <p className="text-[15px] leading-relaxed text-ink-500">
            Sua solicitação será avaliada pela coordenação e o contato será feito em breve.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 rounded-section border border-line-divider bg-surface-subtle p-3.5 text-left">
          <InfoRow label="Pedido" value={`#${resultado.idPedido}`} />
          {quantidadeInscricoes != null && (
            <InfoRow
              label="Inscrições"
              value={`${quantidadeInscricoes} pessoa${quantidadeInscricoes > 1 ? 's' : ''}`}
            />
          )}
          {celularPagador && <InfoRow label="Contato" value={celularPagador} />}
        </div>
        <Button onClick={concluir} fullWidth>
          Concluir
        </Button>
      </main>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-ink-500">{label}</span>
      <span className="font-semibold text-ink-900">{value}</span>
    </div>
  )
}
