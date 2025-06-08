import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserDTO, CreateUserDTO, UpdateUserDTO, LoginDTO, Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'https://localhost:7273/api/Usuario';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

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
    return this.http.post<{ message: string; user: UserDTO }>(`${this.apiUrl}/login`, loginDTO).pipe(
      map(response => {
        console.log('Resposta completa:', response); // Depuração
        const userDto = response.user; // Acessa o objeto 'user' da resposta
        const user: Usuario = this.mapUserDtoToUsuario(userDto);
        console.log('Usuário mapeado:', user); // Depuração
        if (user.token) {
          localStorage.setItem(this.TOKEN_KEY, user.token);
        }
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(this.handleError)
    );
  }

    logout(): void {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      this.currentUserSubject.next(null); // Resetar estado
    }

    getToken(): string | null {
      return localStorage.getItem(this.TOKEN_KEY);
    }

    getCurrentUser(): Usuario | null {
      return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
      return !!this.getCurrentUser() && !!this.getToken();
    }

      // Método para obter a URL da fotografia
    getUserPhotoUrl(): string | null {
      const user = this.getCurrentUser();
      if (user?.fotografia) {
        return `https://localhost:7273${user.fotografia}`; // Ajuste a URL base
      }
      return '/assets/default-user.png'; // Ou um placeholder, ex.: '/assets/default-user.png'
    }

 
 private mapUserDtoToUsuario(userDto: UserDTO): Usuario {
  console.log('Mapeando UserDTO:', userDto); // Depuração
  return {
    id: userDto.id,
    numeroUtente: userDto.numeroUtente || '',
    nome: userDto.nome || '', // Confirme que 'nome' é mapeado
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
