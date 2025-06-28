import { CreateActoClinicoDTO, ActoClinicoDTO } from './acto-clinico';
import { CreateUserNaoRegistadoDTO } from './usuario';

export interface PedidoMarcacaoDTO {
  id: number;
  userId: number;
  dataSolicitacao: string; // ISO string format
  estado: string;
  dataInicio: string; // YYYY-MM-DD format
  dataFim: string; // YYYY-MM-DD format
  observacoes?: string;
  actosClinicos: ActoClinicoDTO[];
}

export interface CreatePedidoMarcacaoDTO {
  userId: number;
  dataInicio: string; // YYYY-MM-DD format
  dataFim: string; // YYYY-MM-DD format
  observacoes?: string;
  actosClinicos: CreateActoClinicoDTO[];
}

export interface UpdatePedidoMarcacaoDTO {
  id: number;
  estado: string;
  dataInicio: string; // YYYY-MM-DD format
  dataFim: string; // YYYY-MM-DD format
  observacoes?: string;
  actosClinicos: CreateActoClinicoDTO[];
}

export interface CreatePedidoMarcacaoUtenteNaoRegistadoDTO {
  user: CreateUserNaoRegistadoDTO;
  dataInicio: string; // YYYY-MM-DD format
  dataFim: string; // YYYY-MM-DD format
  observacoes?: string;
  actosClinicos: CreateActoClinicoDTO[];
}
