// Valores inteiros exatos do contrato da API — a ordem precisa ser preservada.
// Usamos objetos const em vez de `enum` (TS enum não é sintaxe "erasable").

export const SituacaoPesquisaPessoa = {
  InscricaoNoLimbo: 0,
  InscricaoRealizada: 1,
  InscricaoNaoExiste: 2,
} as const
export type SituacaoPesquisaPessoa =
  (typeof SituacaoPesquisaPessoa)[keyof typeof SituacaoPesquisaPessoa]

export const TipoInscricao = {
  Infantil: 0,
  Adulto: 1,
} as const
export type TipoInscricao = (typeof TipoInscricao)[keyof typeof TipoInscricao]

export const SituacaoInscricao = {
  Limbo: 0,
  Pendente: 1,
  Aceita: 2,
  Rejeitada: 3,
} as const
export type SituacaoInscricao = (typeof SituacaoInscricao)[keyof typeof SituacaoInscricao]

export const Sexo = {
  Masculino: 0,
  Feminino: 1,
} as const
export type Sexo = (typeof Sexo)[keyof typeof Sexo]

export const TipoPedido = {
  Debito: 0,
  Desconto: 1,
  Isencao: 2,
} as const
export type TipoPedido = (typeof TipoPedido)[keyof typeof TipoPedido]

export const TipoPagamento = {
  Credito: 0,
  Pix: 1,
} as const
export type TipoPagamento = (typeof TipoPagamento)[keyof typeof TipoPagamento]

export const StatusTransacao = {
  Pendente: 0,
  Recebida: 1,
  Cancelada: 2,
} as const
export type StatusTransacao = (typeof StatusTransacao)[keyof typeof StatusTransacao]
