import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDTO, CreateUserDTO } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:5000/api/usuarios'; // Ajuste para a URL do seu backend

  constructor(private http: HttpClient) {}

  cadastrarUsuario(userDto: CreateUserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}/cadastrar`, userDto).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro ao processar a solicitação.';
    if (error.status === 409) {
      errorMessage = 'Um usuário com este email já existe.';
    } else if (error.status === 400) {
      errorMessage = error.error || 'Dados inválidos. Verifique os campos e tente novamente.';
    }
    return throwError(() => new Error(errorMessage));
  }
}