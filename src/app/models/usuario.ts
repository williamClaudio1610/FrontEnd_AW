export interface Usuario {
    id: number;
    nome: string;
    email: string;
    senhaHash: string;
    isAdmin: boolean;
  }
  export interface RegisterUser {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    province: string;
    perfil: string;
  }

  export interface UserDTO {
    id: number;
    numeroUtente: string;
    fotografia?: string;
    nome: string;
    dataNascimento?: Date;
    genero?: string;
    telemovel?: string;
    email: string;
    morada?: string;
    perfil: string;
  }

  export interface CreateUserDTO {
    fotografia?: string;
    nome: string;
    dataNascimento?: Date; // Opcional para evitar erro, mas deve ser ajustado no backend se for obrigatório
    genero?: string; // Opcional para evitar erro
    telemovel: string;
    email: string;
    morada: string;
    senhaHash: string;
    perfil: string;
  }
  
  export interface UsuarioLoginDTO {
    email: string;
    senha: string;
  }
  
  export interface UsuarioUpdateDTO {
    id: number;
    nome: string;
    email: string;
    isAdmin?: boolean;
  }

  export interface LoginResponse {
    message: string;
    user: Usuario;
    token: string;
  }