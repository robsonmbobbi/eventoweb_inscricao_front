import { isValidCardNumber, isValidCvv, isValidExpiry } from '../../lib/cartao'
import { isValidCpf, onlyDigits } from '../../lib/cpf'
import type { DTODadosCartaoPedido } from '../../types/dtos'

/** Estado do formulário de cartão. Vive só no estado local da tela de pedido — nunca em store ou navigate state. */
export interface DadosCartaoForm {
  numeroCartao: string
  nomeImpressoCartao: string
  /** Validade sem máscara: MMAA. */
  validade: string
  codigoSeguranca: string
  titularEhPagador: boolean
  nomeTitular: string
  emailTitular: string
  cpfOuCnpjTitular: string
  telefoneTitular: string
  cepTitular: string
  numeroEnderecoTitular: string
  complementoEnderecoTitular: string
}

export const DADOS_CARTAO_VAZIO: DadosCartaoForm = {
  numeroCartao: '',
  nomeImpressoCartao: '',
  validade: '',
  codigoSeguranca: '',
  titularEhPagador: true,
  nomeTitular: '',
  emailTitular: '',
  cpfOuCnpjTitular: '',
  telefoneTitular: '',
  cepTitular: '',
  numeroEnderecoTitular: '',
  complementoEnderecoTitular: '',
}

interface Pagador {
  nome: string
  email: string
  cpf: string
  celular: string
}

/** Retorna a primeira mensagem de erro do formulário, ou null se estiver válido. */
export function validarDadosCartao(form: DadosCartaoForm): string | null {
  if (!isValidCardNumber(form.numeroCartao)) return 'Número do cartão inválido.'
  if (!form.nomeImpressoCartao.trim()) return 'Informe o nome impresso no cartão.'
  if (!isValidExpiry(form.validade.slice(0, 2), form.validade.slice(2)))
    return 'Validade do cartão inválida ou vencida.'
  if (!isValidCvv(form.codigoSeguranca)) return 'Código de segurança (CVV) inválido.'

  if (!form.titularEhPagador) {
    if (!form.nomeTitular.trim() || !form.emailTitular.trim() || !form.telefoneTitular)
      return 'Preencha os dados do titular do cartão.'
    const documento = onlyDigits(form.cpfOuCnpjTitular)
    if (!(documento.length === 14 || isValidCpf(documento)))
      return 'CPF ou CNPJ do titular inválido.'
  }

  if (onlyDigits(form.cepTitular).length !== 8) return 'Informe o CEP do titular do cartão.'
  if (!form.numeroEnderecoTitular.trim()) return 'Informe o número do endereço do titular.'
  return null
}

export function montarDadosCartao(form: DadosCartaoForm, pagador: Pagador): DTODadosCartaoPedido {
  const titular = form.titularEhPagador
    ? { nome: pagador.nome, email: pagador.email, documento: pagador.cpf, telefone: pagador.celular }
    : {
        nome: form.nomeTitular,
        email: form.emailTitular,
        documento: form.cpfOuCnpjTitular,
        telefone: form.telefoneTitular,
      }

  return {
    numeroCartao: onlyDigits(form.numeroCartao),
    nomeImpressoCartao: form.nomeImpressoCartao.trim(),
    mesExpiracao: form.validade.slice(0, 2),
    anoExpiracao: form.validade.slice(2),
    codigoSeguranca: onlyDigits(form.codigoSeguranca),
    nomeTitular: titular.nome.trim(),
    emailTitular: titular.email.trim(),
    cpfOuCnpjTitular: onlyDigits(titular.documento),
    cepTitular: onlyDigits(form.cepTitular),
    numeroEnderecoTitular: form.numeroEnderecoTitular.trim(),
    complementoEnderecoTitular: form.complementoEnderecoTitular.trim() || null,
    telefoneTitular: onlyDigits(titular.telefone),
  }
}
