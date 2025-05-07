export interface UserDTO {
  id: number;
  numeroUtente?: string;
  nome: string;
  email: string;
  perfil: string;
  token?: string;
  dataNascimento?: Date;
  genero?: string;
  telemovel?: string;
  morada?: string;
  fotografia?: string; // adicionar se pretende que o back-end envie futuramente
}

export interface CreateUserDTO {
  fotografia?: string;
  nome: string;
  dataNascimento?: Date;
  genero: string;
  telemovel: string;
  email: string;
  morada: string;
  senhaHash: string;
  perfil: string;
}

export interface UpdateUserDTO {
  id: number;
  fotografia?: string;
  nome?: string;
  dataNascimento?: Date;
  genero?: string;
  telemovel?: string;
  email?: string;
  morada?: string;
  senhaHash?: string;
  perfil?: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface Usuario {
  id: number;
  numeroUtente: string;
  nome: string;
  email: string;
  perfil: string;
  token?: string;
  telemovel: string;
  morada: string;
  dataNascimento: string; // Alterado para string
  genero: string;
  fotografia?: string;
}
