import { apiClient } from './client'
import type { DTOFormaPagamento } from '../types/dtos'

export async function listarFormasPagamento(idEvento: number): Promise<DTOFormaPagamento[]> {
  const { data } = await apiClient.get<DTOFormaPagamento[]>(
    `/formaspagamento/listar/${idEvento}`,
  )
  return data ?? []
}
