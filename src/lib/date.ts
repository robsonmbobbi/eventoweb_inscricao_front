import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/** Formata uma data ISO (ou yyyy-MM-dd) para exibição dd/mm/aaaa. */
export function formatDate(isoDate: string): string {
  return format(parseISO(isoDate), 'dd/MM/yyyy', { locale: ptBR })
}

/** Formata um período curto (ex.: "10/03 a 28/03/2026"). */
export function formatDateRange(startIso: string, endIso: string): string {
  const start = parseISO(startIso)
  const end = parseISO(endIso)
  return `${format(start, 'dd/MM', { locale: ptBR })} a ${format(end, 'dd/MM/yyyy', { locale: ptBR })}`
}

/** Converte o valor de um <input type="date"> (yyyy-MM-dd) para ISO 8601 completo, como a API espera. */
export function inputDateToIso(value: string): string {
  return new Date(`${value}T00:00:00`).toISOString()
}

/** Converte uma data ISO vinda da API para o valor esperado por <input type="date"> (yyyy-MM-dd). */
export function isoToInputDate(isoDate: string): string {
  return format(parseISO(isoDate), 'yyyy-MM-dd')
}
