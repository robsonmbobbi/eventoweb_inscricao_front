import type {
  Sexo,
  SituacaoInscricao,
  SituacaoPesquisaPessoa,
  StatusTransacao,
  TipoInscricao,
  TipoPagamento,
  TipoPedido,
} from './enums'

export interface DTOEvento {
  id: number
  nome: string
  dataInicialInscricao: string
  dataFinalInscricao: string
  dataInicialRealizacao: string
  dataFinalRealizacao: string
  idadeMinimaAdulto: number
  logotipo: string | null
  regulamento: string | null
}

export interface DTOPessoa {
  nome: string
  dataNascimento: string | null
  cpf: string
  alergiaAlimentos: string | null
  celular: string
  ehDiabetico: boolean
  ehVegetariano: boolean
  email: string
  sexo: Sexo | null
  usaAdocanteDiariamente: boolean
  uf: string | null
  cidade: string | null
}

export interface DTOResponsavel {
  idInscricao: number
  cpf: string | null
  nome: string | null
}

export interface DTOInscricao {
  id: number | null
  tipo: TipoInscricao
  idEvento: number
  instituicoesEspiritasFrequenta: string | null
  dormeEvento: boolean
  nomeCracha: string | null
  observacoes: string | null
  pessoa: DTOPessoa
  responsavel1: DTOResponsavel | null
  responsavel2: DTOResponsavel | null
  situacao: SituacaoInscricao | null
}

export interface DTOInscricaoPesquisaPessoa {
  situacao: SituacaoPesquisaPessoa
  inscricao: DTOInscricao | null
  pessoa: DTOPessoa | null
}

export interface DTOIdadeResultado {
  idade: number
}

export interface DTOFormaPagamento {
  id: number
  nome: string
  nrParcelasMinima: number
  nrParcelasMaxima: number
  tipo: TipoPagamento
}

export interface DTOPrecosInscricaoForma {
  forma: DTOFormaPagamento
  preco: number
}

export interface DTOPrecoInscricao {
  id: number
  idadeMax: number
  valores: DTOPrecosInscricaoForma[]
}

/** Dados do cartão para cobrança direta (checkout transparente). Nunca persistir no front. */
export interface DTODadosCartaoPedido {
  numeroCartao: string
  nomeImpressoCartao: string
  mesExpiracao: string
  anoExpiracao: string
  codigoSeguranca: string
  nomeTitular: string
  emailTitular: string
  cpfOuCnpjTitular: string
  cepTitular: string
  numeroEnderecoTitular: string
  complementoEnderecoTitular: string | null
  telefoneTitular: string
}

/** Corpo enviado a POST /pedidos/incluir. `dadosCartao` é obrigatório quando a forma é cartão de crédito. */
export interface DTOPedidoInclusao {
  idEvento: number
  idsInscricoes: number[]
  valor: number
  tipo: TipoPedido
  idFormaPagamento: number | null
  nomePagador: string
  cpfPagador: string
  celularPagador: string
  emailPagador: string
  numeroParcelas: number | null
  dadosCartao: DTODadosCartaoPedido | null
  motivo: string | null
}

export interface DTODebitoPedido {
  tipoTransacao: TipoPagamento
  status: StatusTransacao
  imagemQRCodePixBase64: string | null
  pixCopiaECola: string | null
  /** Fallback quando a cobrança com cartão não é concluída na hora. */
  linkPagamento: string | null
}

export interface DTOResultadoPedido {
  idPedido: number
  idEvento: number
  valor: number
  tipo: TipoPedido
  idFormaPagamento: number | null
  debito: DTODebitoPedido | null
}
