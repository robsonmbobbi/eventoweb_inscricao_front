import { apiClient } from './client'
import type { DTOInscricao, DTOInscricaoPesquisaPessoa } from '../types/dtos'

export async function pesquisarPorCpf(
  idEvento: number,
  cpf: string,
): Promise<DTOInscricaoPesquisaPessoa> {
  const { data } = await apiClient.get<DTOInscricaoPesquisaPessoa>(
    `/inscricoes/pesquisar/evento/${idEvento}/cpf/${cpf}`,
  )
  return data
}

export async function incluirInscricao(inscricao: DTOInscricao): Promise<DTOInscricao> {
  const { data } = await apiClient.post<DTOInscricao>('/inscricoes/incluir', inscricao)
  return data
}

/** O back responde sem corpo (void). */
export async function atualizarInscricao(inscricao: DTOInscricao): Promise<void> {
  await apiClient.put('/inscricoes/atualizar', inscricao)
}
