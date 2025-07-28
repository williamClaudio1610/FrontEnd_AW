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
  estado: string;
}

export interface CreateUserDTO {
  fotografia?: File;
  nome: string;
  dataNascimento?: string;
  genero: string;
  telemovel: string;
  email: string;
  morada: string;
  senhaHash: string;
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
  estado: string;
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
  senhaHash?: string;
  perfil?: string;
  numeroUtente: string;
  estado: string;
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
  dataNascimento?: string;
  genero?: string;
  telemovel?: string;
  morada?: string;
  fotografia?: string;
  estado: string;
}

export interface LoginResponse {
  message: string;
  user: UserDTO;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}