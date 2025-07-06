import { TipoDeConsultaExameDTO } from "./tipo-de-consulta-exame";
import { SubsistemaSaudeDTO } from "./subsistema-saude";
import { ProfissionalDTO } from "./profissional";

export interface ActoClinicoDTO {
  id: number;
  pedidoMarcacaoId: number;
  tipoDeConsultaExameId: number;
  tipoDeConsultaExame?: TipoDeConsultaExameDTO;
  dataHora?: string; // Formato hh:mm (TimeOnly)
  anoMesDia?: string; // Formato YYYY-MM-DD (DateOnly)
  subsistemaSaudeId: number;
  subsistemaSaude?: SubsistemaSaudeDTO;
  profissionais?: ProfissionalDTO[];
}

export interface CreateActoClinicoDTO {
  tipoDeConsultaExameId: number;
  subsistemaSaudeId: number;
  profissionalIds?: number[];
}

export interface UpdateActoClinicoDTO {
  id: number;
  pedidoMarcacaoId: number;
  tipoDeConsultaExameId: number;
  subsistemaSaudeId: number;
  dataHora: string; // Formato hh:mm (TimeOnly) - obrigatório
  anoMesDia: string; // Formato YYYY-MM-DD (DateOnly) - obrigatório
  profissionalIds: number[]; // Obrigatório
}