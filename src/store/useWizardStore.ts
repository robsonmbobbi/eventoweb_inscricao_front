import { create } from 'zustand'
import type { DTOInscricaoPesquisaPessoa } from '../types/dtos'
import type { TipoInscricao } from '../types/enums'

/** Estado transitório do wizard de uma inscrição (telas 2 a 5). Não persiste entre reloads. */
interface WizardState {
  regulamentoAceito: boolean
  cpf: string
  pesquisa: DTOInscricaoPesquisaPessoa | null
  dataNascimento: string | null
  idade: number | null
  tipo: TipoInscricao | null
  aceitarRegulamento: () => void
  definirCpf: (cpf: string, pesquisa: DTOInscricaoPesquisaPessoa) => void
  definirNascimento: (dataNascimento: string, idade: number, tipo: TipoInscricao) => void
  /** Reseta tudo, incluindo o aceite do regulamento — usado ao iniciar um pedido novo a partir da tela de Eventos. */
  reset: () => void
  /** Reseta os dados da pessoa em edição, mantendo o aceite do regulamento — usado ao adicionar mais uma inscrição ao mesmo pedido. */
  resetParaNovaInscricao: () => void
}

const dadosPessoaIniciais = {
  cpf: '',
  pesquisa: null,
  dataNascimento: null,
  idade: null,
  tipo: null,
} satisfies Partial<WizardState>

const initialState = {
  regulamentoAceito: false,
  ...dadosPessoaIniciais,
} satisfies Partial<WizardState>

export const useWizardStore = create<WizardState>((set) => ({
  ...initialState,
  aceitarRegulamento: () => set({ regulamentoAceito: true }),
  definirCpf: (cpf, pesquisa) => set({ cpf, pesquisa }),
  definirNascimento: (dataNascimento, idade, tipo) => set({ dataNascimento, idade, tipo }),
  reset: () => set(initialState),
  resetParaNovaInscricao: () => set(dadosPessoaIniciais),
}))
