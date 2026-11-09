import { apiClient } from './client'
import type { DTOEvento, DTOIdadeResultado } from '../types/dtos'

export async function listarEventos(): Promise<DTOEvento[]> {
  const { data } = await apiClient.get<DTOEvento[]>('/eventos/listar')
  return data ?? []
}

export async function obterEvento(idEvento: number): Promise<DTOEvento> {
  const { data } = await apiClient.get<DTOEvento>(`/eventos/obter/${idEvento}`)
  return data
}

export async function obterIdade(idEvento: number, dataNascimento: string): Promise<number> {
  const { data } = await apiClient.get<DTOIdadeResultado>(
    `/eventos/${idEvento}/obter-idade/${dataNascimento}`,
  )
  return data.idade
}
