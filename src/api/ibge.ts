import axios from 'axios'

const IBGE_LOCALIDADES_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades'

interface MunicipioIbge {
  id: number
  nome: string
}

/** Chama o IBGE direto (não o apiClient, que aponta para o back e tem interceptor próprio). */
export async function listarMunicipios(uf: string): Promise<string[]> {
  const { data } = await axios.get<MunicipioIbge[]>(
    `${IBGE_LOCALIDADES_URL}/estados/${uf}/municipios`,
    { params: { orderBy: 'nome' } },
  )
  return data.map((municipio) => municipio.nome)
}

/** Minúsculas e sem acentos, para comparar nomes de municípios digitados pelo usuário. */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
}
