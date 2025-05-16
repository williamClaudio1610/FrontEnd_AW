export interface ProfissionalDTO {
  id: number;
  nome: string;
  tipoDeConsultaExameId: number;
  tipoDeConsultaExameNome: string;
  numeroLicenca: string;
  email: string;
  telefone: string;
}

export interface CreateProfissionalDTO {
  nome: string;
  tipoDeConsultaExameId: number;
  numeroLicenca: string;
  email: string;
  telefone: string;
}

export interface UpdateProfissionalDTO {
  id: number;
  nome?: string;
  tipoDeConsultaExameId?: number;
  numeroLicenca?: string;
  email?: string;
  telefone?: string;
}

export interface Profissional {
  id: number;
  nome: string;
  tipoDeConsultaExameId: number;
  tipoDeConsultaExameNome: string;
  numeroLicenca: string;
  email: string;
  telefone: string;
}