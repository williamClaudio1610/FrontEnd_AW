import { TipoDeConsultaExame } from "./tipo-de-consulta-exame";
import { SubsistemaSaude } from "./subsistema-saude";
import { Profissional } from "./profissional";


export class ActoClinico {
}
export interface CreateActoClinico {
  tipoDeConsultaExameId: number;
  subsistemaSaudeId: number;
  profissionalIds?: number[];
}

export interface ActoClinico {
  id: number;
  horario: string;
  pedidoMarcacaoId: number;
  tipoDeConsultaExameId: number;
  tipoDeConsultaExame: TipoDeConsultaExame;
  subsistemaSaudeId: number;
  subsistemaSaude: SubsistemaSaude;
  profissionais: Profissional[];
}

export interface ActoClinicoDTO {
  id: number;
  pedidoMarcacaoId: number;
  tipoDeConsultaExameId: number;
  tipoDeConsultaExame: TipoDeConsultaExame;
  dataHora?: Date; // Opcional, nullable
  anoMesDia?: Date; // Opcional, nullable (converte DateOnly para Date)
  subsistemaSaudeId: number;
  subsistemaSaude: SubsistemaSaude;
  profissionais: Profissional[];
}

export interface UpdateActoClinicoDTO {
  id: number;
  pedidoMarcacaoId: number;
  tipoDeConsultaExameId: number;
  subsistemaSaudeId: number;
  dataHora: Date;
  anoMesDia: Date;
  profissionalIds?: number[];
}