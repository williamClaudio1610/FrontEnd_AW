import { CreateActoClinico, ActoClinico } from './acto-clinico';
import { CreateUserNaoRegistadoDTO } from './usuario';

export class PedidoMarcacao {
}
export interface CreatePedidoMarcacaoUtenteNaoRegistado {
  user: CreateUserNaoRegistadoDTO;
  dataAgendamento: string; // DateTime será tratado como string em formato ISO (ex.: "2025-05-20T10:00:00.000Z")
  observacoes?: string;
  actosClinicos: CreateActoClinico[];
}

export interface PedidoMarcacaoDTO {
  id: number;
  userId: number;
  dataSolicitacao: string;
  estado: string;
  dataAgendamento: string;
  observacoes: string;
  actosClinicos: ActoClinico[];
}

export interface PedidoMarcacaoResponse {
  message: string;
  pedido: PedidoMarcacao;
}

export interface CreatePedidoMarcacaoDTO{
    userId: number;
    dataAgendamento: string; // DateTime será tratado como string em formato ISO (ex.: "2025-05-20T10:00:00.000Z")
    observacoes?: string;
    actosClinicos: ActoClinico[];
}

export interface UpdatePedidoMarcacaoDTO
{
	id: number;
	estado: string;
	dataAgendamento: string; // DateTime será tratado como string em formato ISO (ex.: "2025-05-20T10:00:00.000Z") 
	observacoes?: string;
	actosClinicos: CreateActoClinico[];
}