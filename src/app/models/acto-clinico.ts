import { TipoDeConsultaExame } from "./tipo-de-consulta-exame";
import { SubsistemaSaude } from "./subsistema-saude";
import { Profissional } from "./profissional";


export class ActoClinico {
}
export interface CreateActoClinico {
  horario: string;
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