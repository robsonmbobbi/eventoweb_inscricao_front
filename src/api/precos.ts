import { apiClient } from './client'
import type { DTOPrecoInscricao } from '../types/dtos'

export async function obterPrecoInscricao(
  idEvento: number,
  dataNascimento: string,
): Promise<DTOPrecoInscricao> {
  const { data } = await apiClient.get<DTOPrecoInscricao>(
    `/precosinscricao/evento/${idEvento}/obter/nascimento/${dataNascimento}`,
  )
  return data
}
