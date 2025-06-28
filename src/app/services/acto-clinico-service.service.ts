import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActoClinicoDTO, CreateActoClinicoDTO, UpdateActoClinicoDTO } from '../models/acto-clinico';

@Injectable({
  providedIn: 'root'
})
export class ActoClinicoServiceService {

  private apiUrl = 'https://localhost:7273/api/ActoClinico';

  constructor(private http: HttpClient) {}

  // Criar ato clínico
  criarActo(acto: CreateActoClinicoDTO): Observable<{ message: string; acto: ActoClinicoDTO }> {
    return this.http.post<{ message: string; acto: ActoClinicoDTO }>(`${this.apiUrl}/criar`, acto)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Atualizar ato clínico
  atualizarActo(acto: UpdateActoClinicoDTO): Observable<{ message: string; acto: ActoClinicoDTO }> {
    return this.http.put<{ message: string; acto: ActoClinicoDTO }>(`${this.apiUrl}/atualizar`, acto)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Deletar ato clínico
  deletarActo(actoId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete/${actoId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obter ato clínico por ID
  getActoById(actoId: number): Observable<ActoClinicoDTO> {
    return this.http.get<ActoClinicoDTO>(`${this.apiUrl}/${actoId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obter atos clínicos por pedido
  getActosByPedidoId(pedidoId: number): Observable<ActoClinicoDTO[]> {
    return this.http.get<ActoClinicoDTO[]>(`${this.apiUrl}/pedido/${pedidoId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obter atos clínicos por tipo de consulta/exame
  getActosByTipoId(tipoId: number): Observable<ActoClinicoDTO[]> {
    return this.http.get<ActoClinicoDTO[]>(`${this.apiUrl}/tipo/${tipoId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obter atos clínicos por subsistema de saúde
  getActosBySubsistemaId(subsistemaId: number): Observable<ActoClinicoDTO[]> {
    return this.http.get<ActoClinicoDTO[]>(`${this.apiUrl}/subsistema/${subsistemaId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obter atos clínicos por profissional
  getActosByProfissionalId(profissionalId: number): Observable<ActoClinicoDTO[]> {
    return this.http.get<ActoClinicoDTO[]>(`${this.apiUrl}/profissional/${profissionalId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obter todos os atos clínicos
  getTodosActos(): Observable<ActoClinicoDTO[]> {
    return this.http.get<ActoClinicoDTO[]>(`${this.apiUrl}/todos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      // Erro no lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro no lado do servidor
      errorMessage = `Código de erro: ${error.status}\nMensagem: ${error.error?.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}