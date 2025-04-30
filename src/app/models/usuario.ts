export interface UserDTO {
  id: number;
  numeroUtente: string;
  nome: string;
  email: string;
  perfil: string;
  token?: string; // Opcional, já que o backend não retorna um token real
  dataNascimento?: Date;
  genero?: string;
  telemovel?: string;
  morada?: string;
}

export interface CreateUserDTO {
  fotografia?: string;
  nome: string;
  dataNascimento?: Date;
  genero?: string;
  telemovel: string;
  email: string;
  morada: string;
  senhaHash: string;
  perfil: string;
  provincia?: string;
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

// Modelo para o formulário de registro
export interface RegisterUser {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  province: string;
  perfil: string;
}

// Modelo para o usuário no contexto do componente que você forneceu
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  isAdmin: boolean;
}