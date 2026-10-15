import { create } from 'zustand'
import type { DTOInscricao } from '../types/dtos'

/** Carrinho do pedido: 100% em memória, sem persistência entre reloads (decisão confirmada). */
interface PedidoState {
  inscricoes: DTOInscricao[]
  adicionarInscricao: (inscricao: DTOInscricao) => void
  limpar: () => void
}

export const usePedidoStore = create<PedidoState>((set) => ({
  inscricoes: [],
  adicionarInscricao: (inscricao) =>
    set((state) => ({ inscricoes: [...state.inscricoes, inscricao] })),
  limpar: () => set({ inscricoes: [] }),
}))
