import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { obterEvento } from '../../api/eventos'
import { listarFormasPagamento } from '../../api/formasPagamento'
import { obterPrecoInscricao } from '../../api/precos'
import { incluirPedido } from '../../api/pedidos'
import { ApiError } from '../../api/client'
import { Header } from '../../components/Header'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { FormField } from '../../components/ui/FormField'
import { Input } from '../../components/ui/Input'
import { MaskedInput } from '../../components/ui/MaskedInput'
import { RadioCard } from '../../components/ui/RadioCard'
import { TextArea } from '../../components/ui/TextArea'
import { formatCurrency } from '../../lib/currency'
import { onlyDigits } from '../../lib/cpf'
import { TipoPagamento, TipoPedido } from '../../types/enums'
import { usePedidoStore } from '../../store/usePedidoStore'
import { InscricaoCartItem } from './InscricaoCartItem'
import { DadosCartaoFields } from './DadosCartaoFields'
import {
  DADOS_CARTAO_VAZIO,
  montarDadosCartao,
  validarDadosCartao,
  type DadosCartaoForm,
} from './dadosCartao'

type Intencao = 'pagar' | 'desconto' | 'isencao'

export function PedidoPage() {
  const { idEvento } = useParams()
  const navigate = useNavigate()
  const { inscricoes, limpar } = usePedidoStore(useShallow((state) => ({
    inscricoes: state.inscricoes,
    limpar: state.limpar,
  })))

  useEffect(() => {
    if (inscricoes.length === 0) navigate('/eventos', { replace: true })
  }, [inscricoes.length, navigate])

  const { data: evento } = useQuery({
    queryKey: ['evento', idEvento],
    queryFn: () => obterEvento(Number(idEvento)),
  })

  const { data: formas } = useQuery({
    queryKey: ['formasPagamento', idEvento],
    queryFn: () => listarFormasPagamento(Number(idEvento)),
  })

  const precosQueries = useQueries({
    queries: inscricoes.map((inscricao) => ({
      queryKey: ['precoInscricao', idEvento, inscricao.pessoa.dataNascimento],
      queryFn: () =>
        obterPrecoInscricao(Number(idEvento), inscricao.pessoa.dataNascimento as string),
      enabled: Boolean(inscricao.pessoa.dataNascimento),
    })),
  })

  const [intencao, setIntencao] = useState<Intencao>('pagar')
  const [formaIdEscolhida, setFormaIdEscolhida] = useState<number | null>(null)
  const [motivo, setMotivo] = useState('')
  const [nomePagador, setNomePagador] = useState('')
  const [cpfPagador, setCpfPagador] = useState('')
  const [celularPagador, setCelularPagador] = useState('')
  const [emailPagador, setEmailPagador] = useState('')
  const [dadosCartao, setDadosCartao] = useState<DadosCartaoForm>(DADOS_CARTAO_VAZIO)
  const [parcelasEscolhidas, setParcelasEscolhidas] = useState<number | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const formaId = formaIdEscolhida ?? formas?.[0]?.id ?? null

  const valorPorInscricao = useMemo(
    () =>
      precosQueries.map((query) => {
        const preco = query.data
        if (!preco || formaId == null) return null
        return preco.valores.find((v) => v.forma.id === formaId)?.preco ?? null
      }),
    [precosQueries, formaId],
  )

  const totalCalculavel = valorPorInscricao.every((v) => v != null)
  const total = totalCalculavel
    ? valorPorInscricao.reduce((sum, v) => sum + (v ?? 0), 0)
    : null

  const formaEscolhida = formas?.find((f) => f.id === formaId)
  const pagarComCartao = intencao === 'pagar' && formaEscolhida?.tipo === TipoPagamento.Credito
  const numeroParcelas = parcelasEscolhidas ?? Math.max(1, formaEscolhida?.nrParcelasMinima ?? 1)

  const finalizar = useMutation({
    mutationFn: incluirPedido,
    onSuccess: (resultado) => {
      const quantidadeInscricoes = inscricoes.length
      limpar()
      navigate(`/eventos/${idEvento}/resultado`, {
        state: {
          resultado,
          quantidadeInscricoes,
          emailPagador,
          celularPagador,
          numeroParcelas: pagarComCartao ? numeroParcelas : undefined,
        },
      })
    },
    onError: (error) => {
      setErro(error instanceof ApiError ? error.message : 'Não foi possível finalizar o pedido.')
    },
  })

  function handleFinalizar() {
    setErro(null)

    if (!nomePagador || !cpfPagador || !celularPagador || !emailPagador) {
      setErro('Preencha os dados do pagador para continuar.')
      return
    }
    if ((intencao === 'desconto' || intencao === 'isencao') && !motivo.trim()) {
      setErro('Descreva o motivo do pedido de desconto/isenção.')
      return
    }
    if (intencao === 'pagar' && formaId == null) {
      setErro('Selecione uma forma de pagamento.')
      return
    }
    if (pagarComCartao) {
      const erroCartao = validarDadosCartao(dadosCartao)
      if (erroCartao) {
        setErro(erroCartao)
        return
      }
    }
    if (total == null) {
      setErro('Ainda estamos calculando os valores das inscrições. Aguarde um instante.')
      return
    }

    finalizar.mutate({
      idEvento: Number(idEvento),
      idsInscricoes: inscricoes.map((i) => i.id as number),
      valor: total,
      tipo:
        intencao === 'pagar'
          ? TipoPedido.Debito
          : intencao === 'desconto'
            ? TipoPedido.Desconto
            : TipoPedido.Isencao,
      idFormaPagamento: intencao === 'pagar' ? formaId : null,
      nomePagador,
      cpfPagador: onlyDigits(cpfPagador),
      celularPagador: onlyDigits(celularPagador),
      emailPagador,
      numeroParcelas: pagarComCartao ? numeroParcelas : null,
      dadosCartao: pagarComCartao
        ? montarDadosCartao(dadosCartao, {
            nome: nomePagador,
            email: emailPagador,
            cpf: cpfPagador,
            celular: celularPagador,
          })
        : null,
      motivo: intencao !== 'pagar' ? motivo.trim() : null,
    })
  }

  return (
    <div className="min-h-screen bg-surface-page pb-28">
      <Header variant="brand" subtitle={evento?.nome} />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-7 md:px-10">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[22px] font-bold text-ink-900 md:text-[28px]">Seu pedido</h1>
          <span className="text-[14px] text-ink-500">
            Revise as inscrições e escolha como deseja seguir.
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="flex flex-col gap-5">
            <div className="overflow-hidden rounded-section border border-line-card bg-white">
              <div className="flex items-center justify-between border-b border-line-divider px-4 py-3.5">
                <span className="text-[15px] font-bold text-ink-900">Inscrições</span>
                <span className="text-[13px] font-medium text-ink-500">
                  {inscricoes.length} pessoa{inscricoes.length > 1 ? 's' : ''}
                </span>
              </div>
              {inscricoes.map((inscricao, index) => (
                <InscricaoCartItem
                  key={inscricao.id ?? index}
                  inscricao={inscricao}
                  valor={valorPorInscricao[index] ?? null}
                />
              ))}
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => navigate(`/eventos/${idEvento}/cpf`)}
                  className="flex h-[46px] w-full items-center justify-center gap-2 rounded-control border border-dashed border-brand-border bg-brand-tint text-[15px] font-semibold text-brand"
                >
                  <span className="text-[18px]">+</span> Nova inscrição
                </button>
              </div>
            </div>

            <Card title="Dados do responsável pelo pedido">
              <FormField label="Nome" required>
                <Input value={nomePagador} onChange={(e) => setNomePagador(e.target.value)} />
              </FormField>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField label="CPF" required>
                  <MaskedInput mask="000.000.000-00" value={cpfPagador} onChange={setCpfPagador} />
                </FormField>
                <FormField label="Celular" required>
                  <MaskedInput
                    mask="(00) 00000-0000"
                    value={celularPagador}
                    onChange={setCelularPagador}
                  />
                </FormField>
              </div>
              <FormField label="E-mail" required>
                <Input
                  type="email"
                  value={emailPagador}
                  onChange={(e) => setEmailPagador(e.target.value)}
                />
              </FormField>
            </Card>

            <Card title="Como deseja seguir?">
              <div className="flex flex-col gap-2.5">
                <RadioCard
                  title="Pagar agora"
                  subtitle="Pix ou cartão de crédito"
                  selected={intencao === 'pagar'}
                  onSelect={() => setIntencao('pagar')}
                />
                <RadioCard
                  title="Solicitar desconto"
                  subtitle="Sujeito à avaliação da coordenação"
                  selected={intencao === 'desconto'}
                  onSelect={() => setIntencao('desconto')}
                />
                <RadioCard
                  title="Solicitar isenção"
                  subtitle="Sujeito à avaliação da coordenação"
                  selected={intencao === 'isencao'}
                  onSelect={() => setIntencao('isencao')}
                />
              </div>

              {intencao === 'pagar' && formas && formas.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5">
                  {formas.map((forma) => (
                    <RadioCard
                      key={forma.id}
                      title={forma.nome}
                      subtitle={
                        forma.tipo === TipoPagamento.Pix
                          ? 'Confirmação imediata'
                          : 'Aprovação na hora'
                      }
                      selected={formaId === forma.id}
                      onSelect={() => {
                        setFormaIdEscolhida(forma.id)
                        setParcelasEscolhidas(null)
                      }}
                    />
                  ))}
                </div>
              )}

              {pagarComCartao && formaEscolhida && (
                <DadosCartaoFields
                  forma={formaEscolhida}
                  total={total}
                  value={dadosCartao}
                  onChange={(changes) => setDadosCartao((atual) => ({ ...atual, ...changes }))}
                  numeroParcelas={numeroParcelas}
                  onNumeroParcelasChange={setParcelasEscolhidas}
                />
              )}

              {intencao !== 'pagar' && (
                <>
                  <FormField
                    label="Motivo"
                    required
                    hint="A coordenação entrará em contato pelos dados informados."
                  >
                    <TextArea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={4} />
                  </FormField>
                  <Alert variant="warning">
                    A inscrição só será confirmada após a análise do pedido. Nenhum pagamento é
                    cobrado agora.
                  </Alert>
                </>
              )}
            </Card>

            {erro && <Alert variant="error">{erro}</Alert>}
          </div>

          <div className="flex flex-col gap-4 rounded-section border border-line-card bg-white p-5 lg:sticky lg:top-6">
            <h4 className="text-[18px] font-bold text-ink-900">Resumo</h4>
            <div className="flex items-baseline justify-between">
              <span className="text-[14px] font-semibold text-ink-500">
                {intencao === 'pagar' ? 'Total do pedido' : 'Total estimado'}
              </span>
              <span className="text-[26px] font-extrabold tracking-tight text-ink-900">
                {total != null ? formatCurrency(total) : '—'}
              </span>
            </div>
            <Button onClick={handleFinalizar} disabled={finalizar.isPending} fullWidth>
              {finalizar.isPending ? (pagarComCartao ? 'Pagando…' : 'Finalizando…') : 'Finalizar'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
