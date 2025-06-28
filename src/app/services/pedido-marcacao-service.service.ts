import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, retry } from 'rxjs/operators';
import { PedidoMarcacaoDTO, CreatePedidoMarcacaoDTO, UpdatePedidoMarcacaoDTO, CreatePedidoMarcacaoUtenteNaoRegistadoDTO } from '../models/pedido-marcacao';

@Injectable({
  providedIn: 'root'
})
export class PedidoMarcacaoServiceService {

  private apiUrl = 'https://localhost:7273/api/PedidoMarcacao';
  private readonly defaultTimeout = 30000; // 30 segundos
  private readonly maxRetries = 2;

  constructor(private http: HttpClient) {}

  // Criar pedido de marcação para utente registado
  criarPedidoMarcacao(pedido: CreatePedidoMarcacaoDTO): Observable<{ message: string; pedido: PedidoMarcacaoDTO }> {
    return this.http.post<{ message: string; pedido: PedidoMarcacaoDTO }>(`${this.apiUrl}/criarPedidoMarcacao`, pedido)
      .pipe(
        timeout(this.defaultTimeout),
        retry(this.maxRetries),
        catchError(this.handleError)
      );
  }

  // Criar pedido de marcação para utente não registado
  criarPedidoUserNaoRegistado(pedido: CreatePedidoMarcacaoUtenteNaoRegistadoDTO): Observable<{ message: string; pedido: PedidoMarcacaoDTO }> {
    return this.http.post<{ message: string; pedido: PedidoMarcacaoDTO }>(`${this.apiUrl}/criarPedidoUserNaoRegistado`, pedido)
      .pipe(
        timeout(this.defaultTimeout),
        retry(this.maxRetries),
        catchError(this.handleError)
      );
  }

  // Atualizar pedido de marcação
  atualizarPedido(pedido: UpdatePedidoMarcacaoDTO): Observable<{ message: string; pedido: PedidoMarcacaoDTO }> {
    return this.http.put<{ message: string; pedido: PedidoMarcacaoDTO }>(`${this.apiUrl}/atualizar`, pedido)
      .pipe(
        timeout(this.defaultTimeout),
        retry(this.maxRetries),
        catchError(this.handleError)
      );
  }

  // Deletar pedido de marcação
  deletarPedido(pedidoId: number): Observable<{ message: string }> {
    if (!pedidoId || pedidoId <= 0) {
      return throwError(() => new Error('ID do pedido é obrigatório e deve ser válido'));
    }

    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete/${pedidoId}`)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(this.handleError)
      );
  }

  // Obter pedido por ID
  getById(pedidoId: number): Observable<PedidoMarcacaoDTO> {
    if (!pedidoId || pedidoId <= 0) {
      return throwError(() => new Error('ID do pedido é obrigatório e deve ser válido'));
    }

    return this.http.get<PedidoMarcacaoDTO>(`${this.apiUrl}/${pedidoId}`)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(this.handleError)
      );
  }

  // Obter pedidos por usuário ID
  getByUserId(userId: number): Observable<PedidoMarcacaoDTO[]> {
    if (!userId || userId <= 0) {
      return throwError(() => new Error('ID do usuário é obrigatório e deve ser válido'));
    }

    return this.http.get<PedidoMarcacaoDTO[]>(`${this.apiUrl}/usuario/${userId}`)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(this.handleError)
      );
  }

  // Obter todos os pedidos
  getTodosPedidos(): Observable<PedidoMarcacaoDTO[]> {
    return this.http.get<PedidoMarcacaoDTO[]>(`${this.apiUrl}/todosOsPedidos`)
      .pipe(
        timeout(this.defaultTimeout),
        catchError(this.handleError)
      );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    
    if (error.error instanceof ErrorEvent) {
      // Erro no lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro no lado do servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Dados inválidos enviados';
          if (error.error?.errors) {
            const validationErrors = Object.values(error.error.errors).flat().join(', ');
            errorMessage += `: ${validationErrors}`;
          }
          break;
        case 401:
          errorMessage = 'Não autorizado - faça login novamente';
          break;
        case 403:
          errorMessage = 'Acesso negado para esta operação';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado';
          break;
        case 409:
          errorMessage = 'Conflito - o recurso já existe ou não pode ser processado';
          break;
        case 422:
          errorMessage = 'Dados não processáveis';
          if (error.error?.errors) {
            const validationErrors = Object.values(error.error.errors).flat().join(', ');
            errorMessage += `: ${validationErrors}`;
          }
          break;
        case 500:
          errorMessage = 'Erro interno do servidor - tente novamente mais tarde';
          break;
        case 503:
          errorMessage = 'Serviço temporariamente indisponível';
          break;
        default:
          errorMessage = `Código de erro: ${error.status}\nMensagem: ${error.error?.detail || error.message}`;
      }
    }

    // Log do erro para debugging (pode ser removido em produção)
    console.error('Erro no PedidoMarcacaoService:', {
      status: error.status,
      message: errorMessage,
      url: error.url,
      timestamp: new Date().toISOString()
    });

    return throwError(() => new Error(errorMessage));
  };
}