export interface ProfissionalDTO {
  id: number;
  nome: string;
  especialidade: string;
  numeroLicenca: string;
  email: string;
  telefone: string;
}

export interface CreateProfissionalDTO {
  nome: string;
  especialidade: string;
  numeroLicenca: string;
  email: string;
  telefone: string;
}

export interface UpdateProfissionalDTO {
  id: number;
  nome?: string;
  especialidade?: string;
  numeroLicenca?: string;
  email?: string;
  telefone?: string;
}

export interface Profissional {
  id: number;
  nome: string;
  especialidade: string;
  numeroLicenca: string;
  email: string;
  telefone: string;
}