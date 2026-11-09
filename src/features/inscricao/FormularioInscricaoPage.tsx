import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { atualizarInscricao, incluirInscricao } from '../../api/inscricoes'
import { ApiError } from '../../api/client'
import { listarMunicipios, normalizar } from '../../api/ibge'
import { Header } from '../../components/Header'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { CheckboxTile } from '../../components/ui/CheckboxTile'
import { FormField } from '../../components/ui/FormField'
import { Input } from '../../components/ui/Input'
import { MaskedInput } from '../../components/ui/MaskedInput'
import { Select } from '../../components/ui/Select'
import { StepIndicator } from '../../components/ui/StepIndicator'
import { TextArea } from '../../components/ui/TextArea'
import { formatCpf } from '../../lib/cpf'
import { formatDate } from '../../lib/date'
import { Sexo, TipoInscricao } from '../../types/enums'
import type { DTOInscricao, DTOResponsavel } from '../../types/dtos'
import { usePedidoStore } from '../../store/usePedidoStore'
import { useWizardStore } from '../../store/useWizardStore'
import { ResponsavelField } from './ResponsavelField'
import { UFS } from './ufs'

const schema = z.object({
  nome: z.string().min(1, 'Informe o nome completo'),
  nomeCracha: z.string().min(1, 'Informe o nome do crachá').max(150),
  sexo: z.string().min(1, 'Selecione o sexo'),
  email: z.string().min(1, 'Informe o e-mail').email('Informe um e-mail válido'),
  celular: z.string().min(10, 'Informe um celular válido'),
  cidade: z.string().min(1, 'Informe a cidade'),
  uf: z.string().min(1, 'Selecione a UF'),
  dormeEvento: z.boolean(),
  ehDiabetico: z.boolean(),
  ehVegetariano: z.boolean(),
  usaAdocanteDiariamente: z.boolean(),
  alergiaAlimentos: z.string().max(100).optional(),
  observacoes: z.string().optional(),
  instituicoesEspiritasFrequenta: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export function FormularioInscricaoPage() {
  const { idEvento } = useParams()
  const navigate = useNavigate()
  const { cpf, dataNascimento, tipo, pesquisa, resetParaNovaInscricao } = useWizardStore(
    useShallow((state) => ({
      cpf: state.cpf,
      dataNascimento: state.dataNascimento,
      tipo: state.tipo,
      pesquisa: state.pesquisa,
      resetParaNovaInscricao: state.resetParaNovaInscricao,
    })),
  )
  const { inscricoes, adicionarInscricao } = usePedidoStore(useShallow((state) => ({
    inscricoes: state.inscricoes,
    adicionarInscricao: state.adicionarInscricao,
  })))

  const isInfantil = tipo === TipoInscricao.Infantil
  const inscricaoConhecida = pesquisa?.inscricao ?? null
  const pessoaConhecida = inscricaoConhecida?.pessoa ?? pesquisa?.pessoa ?? null

  const [responsavel1, setResponsavel1] = useState<DTOResponsavel | null>(
    inscricaoConhecida?.responsavel1 ?? null,
  )
  const [responsavel2, setResponsavel2] = useState<DTOResponsavel | null>(
    inscricaoConhecida?.responsavel2 ?? null,
  )
  const [erroResponsavel1, setErroResponsavel1] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: pessoaConhecida?.nome ?? '',
      nomeCracha: inscricaoConhecida?.nomeCracha ?? '',
      sexo: pessoaConhecida?.sexo != null ? String(pessoaConhecida.sexo) : '',
      email: pessoaConhecida?.email ?? '',
      celular: pessoaConhecida?.celular ?? '',
      cidade: pessoaConhecida?.cidade ?? '',
      uf: pessoaConhecida?.uf ?? '',
      dormeEvento: inscricaoConhecida?.dormeEvento ?? true,
      ehDiabetico: pessoaConhecida?.ehDiabetico ?? false,
      ehVegetariano: pessoaConhecida?.ehVegetariano ?? false,
      usaAdocanteDiariamente: pessoaConhecida?.usaAdocanteDiariamente ?? false,
      alergiaAlimentos: pessoaConhecida?.alergiaAlimentos ?? '',
      observacoes: inscricaoConhecida?.observacoes ?? '',
      instituicoesEspiritasFrequenta: inscricaoConhecida?.instituicoesEspiritasFrequenta ?? '',
    },
  })

  const uf = useWatch({ control, name: 'uf' })
  const municipios = useQuery({
    queryKey: ['municipios', uf],
    queryFn: () => listarMunicipios(uf),
    enabled: Boolean(uf),
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const salvar = useMutation({
    mutationFn: async (inscricao: DTOInscricao): Promise<DTOInscricao> => {
      if (!inscricaoConhecida) return incluirInscricao(inscricao)
      // PUT /inscricoes/atualizar não devolve corpo: o carrinho recebe o próprio DTO enviado.
      await atualizarInscricao(inscricao)
      return inscricao
    },
    onSuccess: (inscricaoSalva) => {
      adicionarInscricao(inscricaoSalva)
      resetParaNovaInscricao()
      navigate(`/eventos/${idEvento}/pedido`)
    },
    onError: (error) => {
      setError('root', {
        message:
          error instanceof ApiError ? error.message : 'Não foi possível salvar a inscrição.',
      })
    },
  })

  function onSubmit(values: FormValues) {
    if (isInfantil && !responsavel1) {
      setErroResponsavel1(true)
      return
    }

    // Com a lista do IBGE disponível, só aceita município da UF e envia a grafia oficial.
    let cidade = values.cidade.trim()
    if (municipios.data) {
      const cidadeOficial = municipios.data.find((nome) => normalizar(nome) === normalizar(cidade))
      if (!cidadeOficial) {
        setError('cidade', { message: 'Selecione uma cidade da lista' })
        return
      }
      cidade = cidadeOficial
    }

    const inscricao: DTOInscricao = {
      id: inscricaoConhecida?.id ?? null,
      tipo: tipo ?? TipoInscricao.Adulto,
      idEvento: Number(idEvento),
      instituicoesEspiritasFrequenta: !isInfantil
        ? (values.instituicoesEspiritasFrequenta?.trim() || null)
        : null,
      dormeEvento: values.dormeEvento,
      nomeCracha: values.nomeCracha,
      observacoes: values.observacoes?.trim() || null,
      pessoa: {
        nome: values.nome,
        dataNascimento,
        cpf,
        alergiaAlimentos: values.alergiaAlimentos?.trim() || null,
        celular: values.celular,
        ehDiabetico: values.ehDiabetico,
        ehVegetariano: values.ehVegetariano,
        email: values.email,
        sexo: Number(values.sexo) as Sexo,
        usaAdocanteDiariamente: values.usaAdocanteDiariamente,
        uf: values.uf,
        cidade,
      },
      responsavel1: isInfantil ? responsavel1 : null,
      responsavel2: isInfantil ? responsavel2 : null,
      situacao: inscricaoConhecida?.situacao ?? null,
    }

    salvar.mutate(inscricao)
  }

  function cancelar() {
    resetParaNovaInscricao()
    navigate(inscricoes.length > 0 ? `/eventos/${idEvento}/pedido` : '/eventos')
  }

  return (
    <div className="min-h-screen bg-surface-page pb-28">
      <Header
        variant="back"
        title="Dados da inscrição"
        onBack={cancelar}
        badge={isInfantil ? <Badge variant="infantil">Infantil</Badge> : undefined}
      />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-5">
        <StepIndicator current={3} />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Card title="Dados pessoais">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField label="CPF">
                <Input value={formatCpf(cpf)} disabled />
              </FormField>
              <FormField label="Nascimento">
                <Input value={dataNascimento ? formatDate(dataNascimento) : ''} disabled />
              </FormField>
            </div>

            <FormField label="Nome completo" required error={errors.nome?.message}>
              <Input invalid={Boolean(errors.nome)} {...register('nome')} />
            </FormField>

            <FormField
              label="Nome do crachá"
              required
              error={errors.nomeCracha?.message}
              hint="Nome que aparecerá no seu crachá"
            >
              <Input invalid={Boolean(errors.nomeCracha)} maxLength={150} {...register('nomeCracha')} />
            </FormField>

            <FormField label="Sexo" required error={errors.sexo?.message}>
              <Select invalid={Boolean(errors.sexo)} {...register('sexo')}>
                <option value="">Selecione</option>
                <option value={String(Sexo.Feminino)}>Feminino</option>
                <option value={String(Sexo.Masculino)}>Masculino</option>
              </Select>
            </FormField>

            <FormField label="E-mail" required error={errors.email?.message}>
              <Input type="email" invalid={Boolean(errors.email)} {...register('email')} />
            </FormField>

            <FormField label="Celular" required error={errors.celular?.message}>
              <Controller
                control={control}
                name="celular"
                render={({ field }) => (
                  <MaskedInput
                    mask="(00) 00000-0000"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    invalid={Boolean(errors.celular)}
                  />
                )}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr]">
              <FormField label="UF" required error={errors.uf?.message}>
                <Select
                  invalid={Boolean(errors.uf)}
                  {...register('uf', { onChange: () => setValue('cidade', '') })}
                >
                  <option value="">--</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField
                label="Cidade"
                required
                error={errors.cidade?.message}
                hint={
                  municipios.isError
                    ? 'Não foi possível carregar as cidades; digite manualmente.'
                    : undefined
                }
              >
                <Input
                  list="municipios-uf"
                  autoComplete="off"
                  disabled={!uf}
                  placeholder={
                    !uf
                      ? 'Selecione a UF primeiro'
                      : municipios.isLoading
                        ? 'Carregando cidades…'
                        : 'Digite para buscar'
                  }
                  invalid={Boolean(errors.cidade)}
                  {...register('cidade')}
                />
                <datalist id="municipios-uf">
                  {municipios.data?.map((nome) => (
                    <option key={nome} value={nome} />
                  ))}
                </datalist>
              </FormField>
            </div>
          </Card>

          {!isInfantil && (
            <Card title="Instituições espíritas que frequenta">
              <FormField label="Instituições">
                <TextArea {...register('instituicoesEspiritasFrequenta')} rows={3} />
              </FormField>
            </Card>
          )}

          {isInfantil && (
            <Card title="Responsáveis">
              <p className="-mt-1 text-[13px] leading-relaxed text-ink-500">
                O responsável precisa estar inscrito no mesmo evento.
              </p>
              <ResponsavelField
                titulo="Responsável 1"
                obrigatorio
                idEvento={Number(idEvento)}
                value={responsavel1}
                onChange={(value) => {
                  setResponsavel1(value)
                  if (value) setErroResponsavel1(false)
                }}
              />
              {erroResponsavel1 && !responsavel1 && (
                <Alert variant="error">Informe e busque o CPF do responsável 1.</Alert>
              )}
              <ResponsavelField
                titulo="Responsável 2"
                obrigatorio={false}
                idEvento={Number(idEvento)}
                value={responsavel2}
                onChange={setResponsavel2}
              />
            </Card>
          )}

          <Card title="Preferências">
            <div className="grid grid-cols-2 gap-2.5">
              <Controller
                control={control}
                name="dormeEvento"
                render={({ field }) => (
                  <CheckboxTile
                    label="Dorme no evento"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="ehDiabetico"
                render={({ field }) => (
                  <CheckboxTile label="Diabético" checked={field.value} onChange={field.onChange} />
                )}
              />
              <Controller
                control={control}
                name="ehVegetariano"
                render={({ field }) => (
                  <CheckboxTile
                    label="Vegetariano"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="usaAdocanteDiariamente"
                render={({ field }) => (
                  <CheckboxTile
                    label="Usa adoçante"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <FormField label="Alergia a alimentos">
              <Input placeholder="Ex.: castanhas, frutos do mar" {...register('alergiaAlimentos')} />
            </FormField>
          </Card>

          <Card title="Observações">
            <TextArea placeholder="Algo que a organização precise saber?" {...register('observacoes')} />
          </Card>

          {errors.root?.message && <Alert variant="error">{errors.root.message}</Alert>}

          <div className="sticky bottom-0 -mx-5 flex gap-3 border-t border-line-card bg-white px-5 py-4 shadow-sticky">
            <Button type="button" variant="secondary" onClick={cancelar} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={salvar.isPending} className="flex-[1.4]">
              {salvar.isPending ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
