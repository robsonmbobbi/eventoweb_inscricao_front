import { apiClient } from './client'
import type { DTOPessoa } from '../types/dtos'

/** O back responde 204 sem corpo quando não há pessoa com o CPF informado. */
export async function pesquisarPessoaPorCpf(cpf: string): Promise<DTOPessoa | null> {
  const { data } = await apiClient.get<DTOPessoa | ''>(`/pessoas/pesquisar/cpf/${cpf}`)
  return data || null
}
