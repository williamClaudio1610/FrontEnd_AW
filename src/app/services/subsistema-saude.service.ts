import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  SubsistemaSaudeDTO,
  CreateSubsistemaSaudeDTO,
  UpdateSubsistemaSaudeDTO,
  SubsistemaSaude
} from '../models/subsistema-saude';

@Injectable({
  providedIn: 'root'
})
export class SubsistemaSaudeService {
  private apiUrl = 'https://localhost:7273/api/subsistema-saude';

  constructor(private http: HttpClient) {}

  // Listar todos os subsistemas de saúde
  getAllSubsistemasSaude(): Observable<SubsistemaSaude[]> {
    return this.http.get<SubsistemaSaudeDTO[]>(`${this.apiUrl}/todos`).pipe(
      map(subsistemas => subsistemas.map(dto => this.mapSubsistemaSaudeDtoToSubsistemaSaude(dto))),
      catchError(this.handleError)
    );
  }

  // Obter um subsistema de saúde por ID
  getSubsistemaSaudeById(id: number): Observable<SubsistemaSaude> {
    return this.http.get<SubsistemaSaudeDTO>(`${this.apiUrl}/${id}`).pipe(
      map(dto => this.mapSubsistemaSaudeDtoToSubsistemaSaude(dto)),
      catchError(this.handleError)
    );
  }

  // Obter subsistema por nome
  getSubsistemaSaudeByNome(nome: string): Observable<SubsistemaSaude> {
    return this.http.get<SubsistemaSaudeDTO>(`${this.apiUrl}/nome/${nome}`).pipe(
      map(dto => this.mapSubsistemaSaudeDtoToSubsistemaSaude(dto)),
      catchError(this.handleError)
    );
  }

  // Criar um novo subsistema de saúde
  criarSubsistemaSaude(subsistemaDto: CreateSubsistemaSaudeDTO): Observable<SubsistemaSaude> {
    return this.http.post<SubsistemaSaudeDTO>(`${this.apiUrl}/criar`, subsistemaDto).pipe(
      map(dto => this.mapSubsistemaSaudeDtoToSubsistemaSaude(dto)),
      catchError(this.handleError)
    );
  }

  // Atualizar um subsistema de saúde existente
  atualizarSubsistemaSaude(subsistemaDto: UpdateSubsistemaSaudeDTO): Observable<SubsistemaSaude> {
    return this.http.put<SubsistemaSaudeDTO>(`${this.apiUrl}/atualizar`, subsistemaDto).pipe(
      map(dto => this.mapSubsistemaSaudeDtoToSubsistemaSaude(dto)),
      catchError(this.handleError)
    );
  }

  // Deletar um subsistema de saúde
  deletarSubsistemaSaude(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Mapear SubsistemaSaudeDTO para SubsistemaSaude
  private mapSubsistemaSaudeDtoToSubsistemaSaude(dto: SubsistemaSaudeDTO): SubsistemaSaude {
    return {
      id: dto.id,
      nome: dto.nome,
      descricao: dto.descricao || ''
    };
  }

  // Tratamento de erros
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erro na requisição:', error);
    let errorMessage = 'Ocorreu um erro ao processar a solicitação.';
    if (error.status === 0) {
      errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
    } else if (error.status === 404) {
      errorMessage = 'Subsistema de saúde não encontrado.';
    } else if (error.status === 400) {
      errorMessage = error.error || 'Dados inválidos. Verifique os campos e tente novamente.';
    } else if (error.status === 409) {
      errorMessage = 'Um subsistema de saúde com este nome já existe.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
