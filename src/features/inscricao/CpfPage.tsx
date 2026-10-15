import { useMutation, useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { obterEvento } from '../../api/eventos'
import { pesquisarPorCpf } from '../../api/inscricoes'
import { Header } from '../../components/Header'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { MaskedInput } from '../../components/ui/MaskedInput'
import { Modal } from '../../components/ui/Modal'
import { StepIndicator } from '../../components/ui/StepIndicator'
import { ApiError } from '../../api/client'
import { formatCpf, isValidCpf } from '../../lib/cpf'
import { SituacaoPesquisaPessoa } from '../../types/enums'
import { useWizardStore } from '../../store/useWizardStore'

const schema = z.object({
  cpf: z
    .string()
    .min(1, 'Informe o CPF')
    .refine(isValidCpf, 'Informe um CPF válido'),
})
type FormValues = z.infer<typeof schema>

export function CpfPage() {
  const { idEvento } = useParams()
  const navigate = useNavigate()
  const definirCpf = useWizardStore((state) => state.definirCpf)

  const { data: evento } = useQuery({
    queryKey: ['evento', idEvento],
    queryFn: () => obterEvento(Number(idEvento)),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { cpf: '' },
  })

  const pesquisar = useMutation({
    mutationFn: (cpf: string) => pesquisarPorCpf(Number(idEvento), cpf),
    onSuccess: (pesquisa, cpf) => {
      if (pesquisa.situacao === SituacaoPesquisaPessoa.InscricaoRealizada) {
        definirCpf('', pesquisa)
        return
      }
      definirCpf(cpf, pesquisa)
      navigate(`/eventos/${idEvento}/nascimento`)
    },
    onError: (error) => {
      setError('cpf', {
        message: error instanceof ApiError ? error.message : 'Não foi possível verificar o CPF.',
      })
    },
  })

  const jaInscrito = pesquisar.data?.situacao === SituacaoPesquisaPessoa.InscricaoRealizada
  const cpfDigitado = watch('cpf')

  return (
    <div className="min-h-screen bg-surface-page">
      <Header variant="back" title="Nova inscrição" onBack={() => navigate('/eventos')} />
      <main className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-5">
        <StepIndicator current={1} />

        <form
          onSubmit={handleSubmit((values) => pesquisar.mutate(values.cpf))}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-[22px] font-bold text-ink-900">Informe o CPF</h3>
            <p className="text-[15px] leading-relaxed text-ink-500">
              Usamos o CPF para localizar inscrições anteriores da pessoa que está sendo
              inscrita.
            </p>
          </div>

          <Controller
            control={control}
            name="cpf"
            render={({ field }) => (
              <FormField label="CPF" required error={errors.cpf?.message}>
                <MaskedInput
                  mask="000.000.000-00"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="000.000.000-00"
                  invalid={Boolean(errors.cpf)}
                />
              </FormField>
            )}
          />

          <Button type="submit" fullWidth disabled={pesquisar.isPending}>
            {pesquisar.isPending ? 'Verificando…' : 'Prosseguir'}
          </Button>
        </form>
      </main>

      {jaInscrito && (
        <Modal
          title="Esta pessoa já está inscrita neste evento"
          description={`O CPF ${formatCpf(cpfDigitado)} já consta em uma inscrição${
            evento ? ` do ${evento.nome}` : ''
          }.`}
          confirmLabel="Entendi"
          onConfirm={() => {
            pesquisar.reset()
            setValue('cpf', '')
          }}
        />
      )}
    </div>
  )
}
