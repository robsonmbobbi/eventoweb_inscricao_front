import { CheckboxTile } from '../../components/ui/CheckboxTile'
import { FormField } from '../../components/ui/FormField'
import { Input } from '../../components/ui/Input'
import { MaskedInput } from '../../components/ui/MaskedInput'
import { Select } from '../../components/ui/Select'
import { formatCurrency } from '../../lib/currency'
import type { DTOFormaPagamento } from '../../types/dtos'
import type { DadosCartaoForm } from './dadosCartao'

interface DadosCartaoFieldsProps {
  forma: DTOFormaPagamento
  total: number | null
  value: DadosCartaoForm
  onChange: (changes: Partial<DadosCartaoForm>) => void
  numeroParcelas: number
  onNumeroParcelasChange: (parcelas: number) => void
}

export function DadosCartaoFields({
  forma,
  total,
  value,
  onChange,
  numeroParcelas,
  onNumeroParcelasChange,
}: DadosCartaoFieldsProps) {
  const minimo = Math.max(1, forma.nrParcelasMinima)
  const maximo = Math.max(minimo, forma.nrParcelasMaxima)
  const opcoesParcelas = Array.from({ length: maximo - minimo + 1 }, (_, i) => minimo + i)

  return (
    <div className="flex flex-col gap-3.5 border-t border-line-divider pt-3.5">
      <span className="text-[13px] text-ink-500">
        Os dados do cartão são enviados diretamente para a cobrança e não ficam salvos.
      </span>

      <FormField label="Número do cartão" required>
        <MaskedInput
          mask="0000 0000 0000 0000[000]"
          value={value.numeroCartao}
          onChange={(numeroCartao) => onChange({ numeroCartao })}
        />
      </FormField>
      <FormField label="Nome impresso no cartão" required>
        <Input
          value={value.nomeImpressoCartao}
          onChange={(e) => onChange({ nomeImpressoCartao: e.target.value.toUpperCase() })}
          autoComplete="cc-name"
        />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Validade" required>
          <MaskedInput
            mask="00/00"
            placeholder="MM/AA"
            value={value.validade}
            onChange={(validade) => onChange({ validade })}
          />
        </FormField>
        <FormField label="CVV" required>
          <MaskedInput
            mask="0000"
            value={value.codigoSeguranca}
            onChange={(codigoSeguranca) => onChange({ codigoSeguranca })}
          />
        </FormField>
      </div>

      {maximo > 1 && (
        <FormField label="Parcelas" required>
          <Select
            value={numeroParcelas}
            onChange={(e) => onNumeroParcelasChange(Number(e.target.value))}
          >
            {opcoesParcelas.map((n) => (
              <option key={n} value={n}>
                {total != null ? `${n}x de ${formatCurrency(total / n)}` : `${n}x`}
              </option>
            ))}
          </Select>
        </FormField>
      )}

      <CheckboxTile
        label="O titular do cartão é o responsável pelo pedido"
        checked={value.titularEhPagador}
        onChange={(titularEhPagador) => onChange({ titularEhPagador })}
      />

      {!value.titularEhPagador && (
        <>
          <FormField label="Nome do titular" required>
            <Input
              value={value.nomeTitular}
              onChange={(e) => onChange({ nomeTitular: e.target.value })}
            />
          </FormField>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="CPF ou CNPJ do titular" required>
              <Input
                inputMode="numeric"
                value={value.cpfOuCnpjTitular}
                onChange={(e) => onChange({ cpfOuCnpjTitular: e.target.value })}
              />
            </FormField>
            <FormField label="Telefone do titular" required>
              <MaskedInput
                mask="(00) 00000-0000"
                value={value.telefoneTitular}
                onChange={(telefoneTitular) => onChange({ telefoneTitular })}
              />
            </FormField>
          </div>
          <FormField label="E-mail do titular" required>
            <Input
              type="email"
              value={value.emailTitular}
              onChange={(e) => onChange({ emailTitular: e.target.value })}
            />
          </FormField>
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <FormField label="CEP do titular" required>
          <MaskedInput
            mask="00000-000"
            value={value.cepTitular}
            onChange={(cepTitular) => onChange({ cepTitular })}
          />
        </FormField>
        <FormField label="Número" required>
          <Input
            value={value.numeroEnderecoTitular}
            onChange={(e) => onChange({ numeroEnderecoTitular: e.target.value })}
          />
        </FormField>
      </div>
      <FormField label="Complemento">
        <Input
          value={value.complementoEnderecoTitular}
          onChange={(e) => onChange({ complementoEnderecoTitular: e.target.value })}
        />
      </FormField>
    </div>
  )
}
