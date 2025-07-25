import { CreateActoClinicoDTO, ActoClinicoDTO, UpdateActoClinicoDTO } from './acto-clinico';
import { CreateUserNaoRegistadoDTO } from './usuario';

export interface PedidoMarcacaoDTO {
  id: number;
  userId: number;
  dataSolicitacao: string; // ISO string format
  estado: string;
  dataInicio: string; // YYYY-MM-DD format
  dataFim: string; // YYYY-MM-DD format
  horario: string; // HH:mm
  observacoes?: string;
  solicitacaoReagendamento?: boolean;
  solicitacaoCancelamento?: boolean;
  novoDataInicioSoli?: string; // YYYY-MM-DD
  novoDataFimSoli?: string; // YYYY-MM-DD
  novoHorarioSoli?: string; // HH:mm
  actosClinicos: ActoClinicoDTO[];
}

export interface CreatePedidoMarcacaoDTO {
  userId: number;
  dataInicio: string; // YYYY-MM-DD format
  dataFim: string; // YYYY-MM-DD format
  horario: string; // HH:mm
  observacoes?: string;
  actosClinicos: CreateActoClinicoDTO[];
}

export interface UpdatePedidoMarcacaoDTO {
  id: number;
  estado: string;
  dataInicio: string; // YYYY-MM-DD format
  dataFim: string; // YYYY-MM-DD format
  horario: string; // HH:mm
  observacoes: string; // Campo obrigatório conforme backend
  solicitacaoReagendamento?: boolean;
  solicitacaoCancelamento?: boolean;
  novoDataInicioSoli?: string; // YYYY-MM-DD
  novoDataFimSoli?: string; // YYYY-MM-DD
  novoHorarioSoli?: string; // HH:mm
  actosClinicos: UpdateActoClinicoDTO[];
}

export interface CreatePedidoMarcacaoUtenteNaoRegistadoDTO {
  user: CreateUserNaoRegistadoDTO;
  dataInicio: string; // YYYY-MM-DD format
  dataFim: string; // YYYY-MM-DD format
  horario: string; // HH:mm
  observacoes?: string;
  actosClinicos: CreateActoClinicoDTO[];
}
