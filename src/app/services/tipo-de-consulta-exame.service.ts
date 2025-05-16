import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TipoDeConsultaExameDTO, CreateTipoDeConsultaExameDTO, UpdateTipoDeConsultaExameDTO, TipoDeConsultaExame } from '../models/tipo-de-consulta-exame';

@Injectable({
  providedIn: 'root',
})
export class TipoDeConsultaExameService {
  private apiUrl = 'https://localhost:7273/api/TipoDeConsultaExame';

  constructor(private http: HttpClient) {}

  getAllTipos(): Observable<TipoDeConsultaExameDTO[]> {
    return this.http.get<TipoDeConsultaExameDTO[]>(`${this.apiUrl}/ListarTipos`).pipe(
      catchError(this.handleError)
    );
  }

  getTipoById(id: number): Observable<TipoDeConsultaExameDTO> {
    return this.http.get<TipoDeConsultaExameDTO>(`${this.apiUrl}/ObterTipoPorId/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createTipo(tipoDTO: CreateTipoDeConsultaExameDTO): Observable<TipoDeConsultaExameDTO> {
    return this.http.post<TipoDeConsultaExameDTO>(`${this.apiUrl}/CriarTipo`, tipoDTO).pipe(
      catchError(this.handleError)
    );
  }

  updateTipo(id: number, tipoDTO: UpdateTipoDeConsultaExameDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/AtualizarTipo/${id}`, tipoDTO).pipe(
      catchError(this.handleError)
    );
  }

  deleteTipo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ExcluirTipo/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}