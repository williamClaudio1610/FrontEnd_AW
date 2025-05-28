import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PedidoMarcacaoResponse, CreatePedidoMarcacaoUtenteNaoRegistado,
   CreatePedidoMarcacaoDTO, UpdatePedidoMarcacaoDTO } from '../models/pedido-marcacao';

@Injectable({
  providedIn: 'root'
})
export class PedidoMarcacaoServiceService {

 private apiUrl = 'https://localhost:7273/api/PedidoMarcacao';

  constructor(private http: HttpClient) {}

  // Criar pedido de marcação para utente registado
  CriarPedidoMarcacao(pedido: CreatePedidoMarcacaoDTO): Observable<PedidoMarcacaoResponse> {
    return this.http.post<PedidoMarcacaoResponse>(`${this.apiUrl}/criarPedidoMarcacao`, pedido)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Criar pedido de marcação para utente Não registado
  criarPedidoUserNaoRegistado(pedido: CreatePedidoMarcacaoUtenteNaoRegistado): Observable<PedidoMarcacaoResponse> {
    return this.http.post<PedidoMarcacaoResponse>(`${this.apiUrl}/criarPedidoUserNaoRegistado`, pedido)
      .pipe(
        catchError(this.handleError)
      );
  }

  updatePedidoMarcacao(id: number, pedido: UpdatePedidoMarcacaoDTO): Observable<PedidoMarcacaoResponse> {
    return this.http.put<PedidoMarcacaoResponse>(`${this.apiUrl}/atualizar/${id}`, pedido)
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
      errorMessage = `Código de erro: ${error.status}\nMensagem: ${error.error?.detail || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
