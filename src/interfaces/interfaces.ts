export interface Periodo {
  dataInicial: Date;
  dataFinal: Date;
}

export interface EventoListagem {
  id: number;
  periodoInscricao: Periodo;
  periodoRealizacao: Periodo;
  nome: string;
  logotipo: string;
  idadeMinima: number;
  permiteInscricaoInfantil: boolean;
}
