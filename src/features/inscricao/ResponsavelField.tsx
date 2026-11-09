import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { pesquisarPorCpf } from '../../api/inscricoes'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { MaskedInput } from '../../components/ui/MaskedInput'
import { Alert } from '../../components/ui/Alert'
import { TipoInscricao } from '../../types/enums'
import type { DTOResponsavel } from '../../types/dtos'

interface ResponsavelFieldProps {
  titulo: string
  obrigatorio: boolean
  idEvento: number
  value: DTOResponsavel | null
  onChange: (value: DTOResponsavel | null) => void
}

export function ResponsavelField({
  titulo,
  obrigatorio,
  idEvento,
  value,
  onChange,
}: ResponsavelFieldProps) {
  const [cpf, setCpf] = useState(value?.cpf ?? '')
  const [naoEncontrado, setNaoEncontrado] = useState(false)

  const buscar = useMutation({
    mutationFn: () => pesquisarPorCpf(idEvento, cpf),
    onSuccess: (pesquisa) => {
      const inscricaoAdulta =
        pesquisa.inscricao && pesquisa.inscricao.tipo === TipoInscricao.Adulto
          ? pesquisa.inscricao
          : null

      if (inscricaoAdulta?.id != null) {
        setNaoEncontrado(false)
        onChange({ idInscricao: inscricaoAdulta.id, cpf, nome: inscricaoAdulta.pessoa.nome })
      } else {
        setNaoEncontrado(true)
        onChange(null)
      }
    },
    onError: () => {
      setNaoEncontrado(true)
      onChange(null)
    },
  })

  function handleCpfChange(novoCpf: string) {
    setCpf(novoCpf)
    setNaoEncontrado(false)
    onChange(null)
  }

  return (
    <div className="flex flex-col gap-3 rounded-[12px] border border-line-divider bg-surface-subtle p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-bold text-ink-900">{titulo}</span>
        <span
          className={`text-[11px] font-semibold tracking-wide uppercase ${
            obrigatorio ? 'text-danger' : 'text-ink-400'
          }`}
        >
          {obrigatorio ? 'Obrigatório' : 'Opcional'}
        </span>
      </div>

      <FormField label="CPF do responsável" required={obrigatorio}>
        <div className="flex gap-2">
          <MaskedInput
            mask="000.000.000-00"
            value={cpf}
            onChange={handleCpfChange}
            invalid={naoEncontrado}
            placeholder="000.000.000-00"
          />
          <Button
            type="button"
            variant="secondary"
            className="h-[46px] flex-none px-4"
            disabled={cpf.length !== 11 || buscar.isPending}
            onClick={() => buscar.mutate()}
          >
            {buscar.isPending ? '...' : 'Buscar'}
          </Button>
        </div>
      </FormField>

      {value && (
        <FormField label="Nome">
          <div className="flex h-[46px] items-center justify-between rounded-control border border-line-card bg-surface-muted px-3 text-[15px] text-ink-700">
            <span>{value.nome}</span>
            <span className="font-bold text-success">✓</span>
          </div>
        </FormField>
      )}

      {naoEncontrado && (
        <Alert variant="error">
          Não encontramos nenhuma inscrição com esse CPF para ser o responsável!
        </Alert>
      )}
    </div>
  )
}
