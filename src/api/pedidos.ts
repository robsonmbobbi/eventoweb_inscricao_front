import { apiClient } from './client'
import type { DTOPedidoInclusao, DTOResultadoPedido } from '../types/dtos'

export async function incluirPedido(pedido: DTOPedidoInclusao): Promise<DTOResultadoPedido> {
  const { data } = await apiClient.post<DTOResultadoPedido>('/pedidos/incluir', pedido)
  return data
}
