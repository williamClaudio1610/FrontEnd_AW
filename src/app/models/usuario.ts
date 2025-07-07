export interface UserDTO {
  id: number;
  numeroUtente?: string;
  nome: string;
  email: string;
  perfil: string;
  token?: string;
  dataNascimento?: string;
  genero?: string;
  telemovel?: string;
  morada?: string;
  fotografia?: string;
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
}

export interface CreateUserNaoRegistadoDTO{
	Fotografia?: string;
	nome: string;
	numeroUtente: string;
	dataNascimento: string;
	genero: string;
	telemovel: string;  
	email:string
	morada: string;
}

export interface UpdateUserDTO {
  id: number;
  fotografia?: string;
  nome?: string;
  dataNascimento?: string;
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
  numeroUtente?: string;
  nome: string;
  email: string;
  perfil: string;
  token?: string;
  dataNascimento?: string;
  genero?: string;
  telemovel?: string;
  morada?: string;
  fotografia?: string;
}

export interface LoginResponse {
  message: string;
  user: UserDTO;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}