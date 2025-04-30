import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserDTO, CreateUserDTO, UpdateUserDTO, LoginDTO, Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'https://localhost:7273/api/usuario'; // Ajustado para a URL do seu backend

  constructor(private http: HttpClient) {}

  // Buscar todos os usuários
  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<UserDTO[]>(this.apiUrl).pipe(
      map((users: UserDTO[]) => users.map(user => this.mapUserDtoToUsuario(user))),
      catchError(this.handleError)
    );
  }

  // Buscar usuários por termo (nome ou email)
  searchUsuarios(term: string): Observable<Usuario[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}?search=${term}`).pipe(
      map((users: UserDTO[]) => users.map(user => this.mapUserDtoToUsuario(user))),
      catchError(this.handleError)
    );
  }

  // Cadastrar um novo usuário
  cadastrarUsuario(userDto: CreateUserDTO): Observable<Usuario> {
    return this.http.post<UserDTO>(`${this.apiUrl}/criarUser`, userDto).pipe(
      map(user => this.mapUserDtoToUsuario(user)),
      catchError(this.handleError)
    );
  }

  // Atualizar um usuário existente
  updateUsuario(updateDTO: UpdateUserDTO): Observable<Usuario> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${updateDTO.id}`, updateDTO).pipe(
      map(user => this.mapUserDtoToUsuario(user)),
      catchError(this.handleError)
    );
  }

  // Excluir um usuário
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Autenticar um usuário (login)
  login(loginDTO: LoginDTO): Observable<Usuario> {
    return this.http.post<UserDTO>(`${this.apiUrl}/login`, loginDTO).pipe(
      map(user => this.mapUserDtoToUsuario(user)),
      catchError(this.handleError)
    );
  }

  // Função auxiliar para mapear UserDTO para Usuario
  private mapUserDtoToUsuario(userDto: UserDTO): Usuario {
    return {
      id: userDto.id,
      nome: userDto.nome,
      email: userDto.email,
      senhaHash: '', // Não retornamos a senha
      isAdmin: userDto.perfil === 'Administrador',
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro ao processar a solicitação.';
    if (error.status === 409) {
      errorMessage = 'Um usuário com este email já existe.';
    } else if (error.status === 400) {
      errorMessage = error.error || 'Dados inválidos. Verifique os campos e tente novamente.';
    } else if (error.status === 401) {
      errorMessage = 'Email ou senha inválidos.';
    } else if (error.status === 404) {
      errorMessage = 'Usuário não encontrado.';
    }
    return throwError(() => new Error(errorMessage));
  }
}