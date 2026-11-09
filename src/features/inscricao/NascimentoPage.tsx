import { useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { obterEvento, obterIdade } from '../../api/eventos'
import { ApiError } from '../../api/client'
import { Header } from '../../components/Header'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { Input } from '../../components/ui/Input'
import { StepIndicator } from '../../components/ui/StepIndicator'
import { formatCpf } from '../../lib/cpf'
import { inputDateToIso, isoToInputDate } from '../../lib/date'
import { TipoInscricao } from '../../types/enums'
import { useWizardStore } from '../../store/useWizardStore'

const schema = z.object({
  dataNascimento: z.string().min(1, 'Informe a data de nascimento'),
})
type FormValues = z.infer<typeof schema>

export function NascimentoPage() {
  const { idEvento } = useParams()
  const navigate = useNavigate()
  const { cpf, pesquisa, definirNascimento } = useWizardStore(useShallow((state) => ({
    cpf: state.cpf,
    pesquisa: state.pesquisa,
    definirNascimento: state.definirNascimento,
  })))

  const { data: evento } = useQuery({
    queryKey: ['evento', idEvento],
    queryFn: () => obterEvento(Number(idEvento)),
  })

  const dataNascimentoConhecida =
    pesquisa?.inscricao?.pessoa.dataNascimento ?? pesquisa?.pessoa?.dataNascimento ?? null
  const pessoaReconhecida = Boolean(dataNascimentoConhecida)

  const defaultValue = useMemo(
    () => (dataNascimentoConhecida ? isoToInputDate(dataNascimentoConhecida) : ''),
    [dataNascimentoConhecida],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { dataNascimento: defaultValue },
  })

  const prosseguir = useMutation({
    mutationFn: (dataNascimento: string) => obterIdade(Number(idEvento), dataNascimento),
    onSuccess: (idade, dataNascimento) => {
      if (!evento) return
      const tipo = idade < evento.idadeMinimaAdulto ? TipoInscricao.Infantil : TipoInscricao.Adulto
      definirNascimento(inputDateToIso(dataNascimento), idade, tipo)
      navigate(`/eventos/${idEvento}/inscricao/formulario`)
    },
    onError: (error) => {
      setError('dataNascimento', {
        message:
          error instanceof ApiError ? error.message : 'Não foi possível calcular a idade.',
      })
    },
  })

  return (
    <div className="min-h-screen bg-surface-page">
      <Header variant="back" title="Nova inscrição" onBack={() => navigate(`/eventos/${idEvento}/cpf`)} />
      <main className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-5">
        <StepIndicator current={2} />

        <form
          onSubmit={handleSubmit((values) => prosseguir.mutate(values.dataNascimento))}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-[22px] font-bold text-ink-900">Data de nascimento</h3>
            <p className="text-[15px] leading-relaxed text-ink-500">
              {pessoaReconhecida
                ? 'Confira se a data de nascimento está correta antes de prosseguir.'
                : 'Não encontramos inscrições anteriores para este CPF. Informe a data de nascimento para continuar.'}
            </p>
          </div>

          {pessoaReconhecida && (
            <Alert variant="info">Encontramos uma inscrição anterior para este CPF.</Alert>
          )}

          <FormField label="CPF">
            <Input value={formatCpf(cpf)} disabled />
          </FormField>

          <FormField
            label="Data de nascimento"
            required
            error={errors.dataNascimento?.message}
            hint={pessoaReconhecida ? 'Você pode alterar a data se necessário.' : undefined}
          >
            <Input
              type="date"
              invalid={Boolean(errors.dataNascimento)}
              {...register('dataNascimento')}
            />
          </FormField>

          <Button type="submit" fullWidth disabled={prosseguir.isPending}>
            {prosseguir.isPending ? 'Verificando…' : 'Prosseguir'}
          </Button>
          <button
            type="button"
            onClick={() => navigate(`/eventos/${idEvento}/cpf`)}
            className="text-center text-[14px] font-semibold text-brand"
          >
            Voltar
          </button>
        </form>
      </main>
    </div>
  )
}
