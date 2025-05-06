import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserDTO, CreateUserDTO, UpdateUserDTO, LoginDTO, Usuario } from '../models/usuario';
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'https://localhost:7273/api/Usuario';

  constructor(private http: HttpClient) {}

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/buscarTodos`).pipe(
      map(users => users.map(this.mapUserDtoToUsuario)),
      catchError(this.handleError)
    );
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<UserDTO>(`${this.apiUrl}/buscarPeloId/${id}`).pipe(
      map(this.mapUserDtoToUsuario),
      catchError(this.handleError)
    );
  }

  cadastrarUsuario(userDto: CreateUserDTO): Observable<Usuario> {
    return this.http.post<UserDTO>(`${this.apiUrl}/criarUser`, userDto).pipe(
      map(this.mapUserDtoToUsuario),
      catchError(this.handleError)
    );
  }

  updateUsuario(updateDTO: UpdateUserDTO): Observable<Usuario> {
    return this.http.put<UserDTO>(`${this.apiUrl}/atualizarUser/${updateDTO.id}`, updateDTO).pipe(
      map(this.mapUserDtoToUsuario),
      catchError(this.handleError)
    );
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminarUser/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  login(loginDTO: LoginDTO): Observable<Usuario> {
    return this.http.post<UserDTO>(`${this.apiUrl}/login`, loginDTO).pipe(
      map(userDto => {
        const user = this.mapUserDtoToUsuario(userDto);
        // Armazenar token no localStorage
        if (user.token) {
          localStorage.setItem('token', user.token);
        }
        return user;
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    // Redirecionamento pode ser feito aqui ou em outro serviço
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private mapUserDtoToUsuario(userDto: UserDTO): Usuario {
    return {
      id: userDto.id,
      numeroUtente: userDto.numeroUtente || '',
      nome: userDto.nome || '',
      email: userDto.email || '',
      perfil: userDto.perfil || '',
      token: userDto.token,
      dataNascimento: userDto.dataNascimento ? new Date(userDto.dataNascimento).toISOString().split('T')[0] : '',
      genero: userDto.genero || '',
      telemovel: userDto.telemovel || '',
      morada: userDto.morada || '',
      fotografia: userDto.fotografia
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
