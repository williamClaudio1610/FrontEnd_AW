import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserDTO, CreateUserDTO, UpdateUserDTO, LoginDTO, Usuario, ChangePasswordDTO } from '../models/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'https://localhost:7273/api/Usuario';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private readonly PASSWORD_KEY = 'current_password'; // Chave para armazenar senha atual

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
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

  cadastrarUsuario(formData: FormData): Observable<Usuario> {
    return this.http.post<UserDTO>(`${this.apiUrl}/criarUser`, formData).pipe(
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
        console.log('Resposta completa:', response);
        const userDto = response.user;
        const user: Usuario = this.mapUserDtoToUsuario(userDto);
        console.log('Usuário mapeado:', user);
        if (user.token) {
          localStorage.setItem(this.TOKEN_KEY, user.token);
        }
        // Armazenar a senha atual para uso em atualizações
        localStorage.setItem(this.PASSWORD_KEY, loginDTO.senha);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(this.handleError)
    );
  }


  logout(): void {
    // Remove dados do localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.PASSWORD_KEY); // Limpar senha armazenada
    this.currentUserSubject.next(null);
  
    // Limpa cache do Service Worker, se registrado
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName); // Deleta todos os caches
        });
      });
    }
  
    // Limpa dados de sessão (opcional)
    sessionStorage.clear();
  
    // Força recarregamento da página para garantir que o cache do navegador seja limpo
    window.location.href = '/paginaInicial'; // Substitui router.navigate para evitar cache
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  getCurrentPassword(): string | null {
    return localStorage.getItem(this.PASSWORD_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!this.getToken();
  }

  getUserPhotoUrl(): string | null {
    const user = this.getCurrentUser();
    if (user?.fotografia) {
      return `https://localhost:7273${user.fotografia}`; // Ajuste a URL base
    }
    return '/assets/default-user.png';
  }

  alterarSenha(novaSenha: string): Observable<Usuario> {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }
  
    // Criar objeto de atualização com todos os campos obrigatórios
    const updateDTO: UpdateUserDTO = {
      id: currentUser.id,
      nome: currentUser.nome,
      email: currentUser.email,
      morada: currentUser.morada || '',
      telemovel: currentUser.telemovel || '',
      genero: currentUser.genero || '',
      senhaHash: novaSenha,
      fotografia: currentUser.fotografia || '',
      dataNascimento: currentUser.dataNascimento,
      perfil: currentUser.perfil // Usar o perfil atual do usuário
    };
  
    return this.http.put<UserDTO>(`${this.apiUrl}/atualizarUser/${currentUser.id}`, updateDTO).pipe(
      map(updatedUser => {
        // Atualizar localmente o usuário com os dados retornados
        const updated = this.mapUserDtoToUsuario(updatedUser);
        
        // Atualizar armazenamento local
        localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
        this.currentUserSubject.next(updated);
        
        return updated;
      }),
      catchError(this.handleError)
    );
  }


  private mapUserDtoToUsuario(userDto: UserDTO): Usuario {
    console.log('Mapeando UserDTO:', userDto);
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
      fotografia: userDto.fotografia || ''
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro ao processar a solicitação.';

    if (error.status === 400) {
      // Se vier um objeto ModelState
      if (error.error && error.error.errors && typeof error.error.errors === 'object') {
        // Extrai todas as mensagens e as junta numa string única
        const allErrors = Object
          .values(error.error.errors)        // pega cada array de mensagens
          .flat()                            // achata num único array
          .filter(msg => !!msg);            // remove vazios
        errorMessage = allErrors.join(' | ');
      } else {
        // Caso venha uma string simples ou outro formato
        errorMessage = typeof error.error === 'string'
          ? error.error
          : JSON.stringify(error.error);
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