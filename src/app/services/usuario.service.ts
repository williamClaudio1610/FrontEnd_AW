import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserDTO, CreateUserDTO, UpdateUserDTO, LoginDTO, Usuario, ChangePasswordDTO, ChangeStatusDTO } from '../models/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'https://localhost:7273/api/Usuario';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      try {
        const parsedUser: Usuario = JSON.parse(storedUser);
        this.currentUserSubject.next(parsedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        this.currentUserSubject.next(null);
      }
    } else {
      this.currentUserSubject.next(null);
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

  cadastrarUsuario(formData: FormData): Observable<Usuario> {
    return this.http.post<UserDTO>(`${this.apiUrl}/criarUser`, formData).pipe(
      map(this.mapUserDtoToUsuario),
      catchError(this.handleError)
    );
  }

  updateUsuario(updateDTO: UpdateUserDTO): Observable<Usuario> {
    const formData = new FormData();
    formData.append('Id', updateDTO.id.toString());
    formData.append('Nome', updateDTO.nome || '');
    formData.append('Email', updateDTO.email || '');
    formData.append('Telemovel', updateDTO.telemovel || '');
    formData.append('Morada', updateDTO.morada || '');
    formData.append('Genero', updateDTO.genero || '');
    formData.append('Perfil', updateDTO.perfil || '');
    formData.append('NumeroUtente', updateDTO.numeroUtente || '');
    formData.append('IsBloqueado', updateDTO.isBloqueado.toString());
    formData.append('DataNascimento', updateDTO.dataNascimento || '');

    if (updateDTO.fotografia) {
      formData.append('Fotografia', updateDTO.fotografia);
    }

    return this.http.put<UserDTO>(`${this.apiUrl}/atualizarUser/${updateDTO.id}`, formData).pipe(
      map(this.mapUserDtoToUsuario),
      catchError(this.handleError)
    );
  }

  changeStatus(changeStatusDTO: ChangeStatusDTO): Observable<Usuario> {
    return this.http.put<UserDTO>(`${this.apiUrl}/mudar-estado`, changeStatusDTO).pipe(
      map(this.mapUserDtoToUsuario),
      catchError(this.handleError)
    );
  }

  changePassword(changePasswordDTO: ChangePasswordDTO): Observable<Usuario> {
    return this.http.put<UserDTO>(`${this.apiUrl}/mudar-senha`, changePasswordDTO).pipe(
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
        const userDto = response.user;
        const user: Usuario = this.mapUserDtoToUsuario(userDto);
        if (user.token) {
          localStorage.setItem(this.TOKEN_KEY, user.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);

    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }

    sessionStorage.clear();
    window.location.href = '/paginaInicial';
  }

  logoutSemRedirect(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);

    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }

    sessionStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): Usuario | null {
    const user = this.currentUserSubject.value;
    return user as Usuario | null;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!this.getToken();
  }

  getUserPhotoUrl(): string | null {
    const user = this.getCurrentUser();
    const baseUrl = 'https://localhost:7273';
    if (user?.fotografia) {
      if (user.fotografia.startsWith('/')) {
        return `${baseUrl}${user.fotografia}`;
      }
      return `${baseUrl}/Uploads/${user.fotografia}`;
    }
    return '/assets/default-user.png';
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
      isBloqueado: userDto.isBloqueado,
      fotografia: userDto.fotografia || ''
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro ao processar a solicitação.';

    if (error.status === 400) {
      if (error.error && error.error.errors && typeof error.error.errors === 'object') {
        const allErrors = Object.values(error.error.errors)
          .flat()
          .filter(msg => !!msg);
        errorMessage = allErrors.join(' | ');
      } else {
        errorMessage = typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
      }
    } else if (error.status === 409) {
      errorMessage = 'Um usuário com este email já existe.';
    } else if (error.status === 401) {
      errorMessage = 'Email ou senha inválidos.';
    } else if (error.status === 404) {
      errorMessage = 'Usuário não encontrado.';
    }

    return throwError(() => new Error(errorMessage));
  }
}