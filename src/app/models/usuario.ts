export interface UserDTO {
  id: number;
  numeroUtente: string;
  nome: string;
  email: string;
  perfil: string;
  token?: string;
  dataNascimento?: string;
  genero?: string;
  telemovel?: string;
  morada?: string;
  fotografia?: string;
  isBloqueado: boolean; // Alterado de estado para isBloqueado
}

export interface CreateUserDTO {
  fotografia?: File;
  nome: string;
  dataNascimento?: string;
  genero: string;
  telemovel: string;
  email: string;
  morada: string;
  senhaHash: string; // Mantido, necessário para criação
  perfil: string;
  numeroUtente: string;
}

export interface CreateUserNaoRegistadoDTO {
  fotografia?: string; // "nenhuma" quando não há foto
  nome: string;
  dataNascimento: string;
  genero: string;
  telemovel: string;
  email: string;
  morada: string;
  perfil?: string; // UtenteAnónimo, UtenteRegistado, etc.
  numeroUtente: string;
}

export interface UpdateUserDTO {
  id: number;
  fotografia?: File;
  nome?: string;
  dataNascimento?: string;
  genero?: string;
  telemovel?: string;
  email?: string;
  morada?: string;
  perfil?: string;
  numeroUtente: string;
  isBloqueado: boolean; // Alterado de estado para isBloqueado
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface ChangePasswordDTO {
  id: number; // Adicionado para corresponder ao backend
  senhaAtual: string; // Renomeado para português
  novaSenha: string; // Renomeado para português
}

export interface ChangeStatusDTO {
  id: number;
  isBloqueado: boolean;
}

export interface Usuario {
  id: number;
  numeroUtente: string;
  nome: string;
  email: string;
  perfil: string;
  token?: string;
  dataNascimento?: string;
  genero?: string;
  telemovel?: string;
  morada?: string;
  fotografia?: string;
  isBloqueado: boolean; // Alterado de estado para isBloqueado
}

export interface LoginResponse {
  message: string;
  user: UserDTO;
}
