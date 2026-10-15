import { createBrowserRouter, Navigate } from 'react-router-dom'
import { EventosPage } from '../features/eventos/EventosPage'
import { RegulamentoPage } from '../features/inscricao/RegulamentoPage'
import { CpfPage } from '../features/inscricao/CpfPage'
import { NascimentoPage } from '../features/inscricao/NascimentoPage'
import { FormularioInscricaoPage } from '../features/inscricao/FormularioInscricaoPage'
import { PedidoPage } from '../features/pedido/PedidoPage'
import { ResultadoPage } from '../features/pagamento/ResultadoPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/eventos" replace /> },
  { path: '/eventos', element: <EventosPage /> },
  { path: '/eventos/:idEvento/regulamento', element: <RegulamentoPage /> },
  { path: '/eventos/:idEvento/cpf', element: <CpfPage /> },
  { path: '/eventos/:idEvento/nascimento', element: <NascimentoPage /> },
  { path: '/eventos/:idEvento/inscricao/formulario', element: <FormularioInscricaoPage /> },
  { path: '/eventos/:idEvento/pedido', element: <PedidoPage /> },
  { path: '/eventos/:idEvento/resultado', element: <ResultadoPage /> },
])
