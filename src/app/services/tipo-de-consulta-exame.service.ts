import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TipoDeConsultaExameDTO, CreateTipoDeConsultaExameDTO, UpdateTipoDeConsultaExameDTO, TipoDeConsultaExame } from '../models/tipo-de-consulta-exame';

@Injectable({
  providedIn: 'root',
})
export class TipoDeConsultaExameService {
  private apiUrl = 'https://localhost:7273/api/tiposdeconsultaexame';

  constructor(private http: HttpClient) {}

  // Listar todos os tipos de consulta/exame
  getAllTiposDeConsultaExame(): Observable<TipoDeConsultaExame[]> {
    return this.http.get<TipoDeConsultaExameDTO[]>(this.apiUrl).pipe(
      map(tipos => tipos.map(dto => this.mapTipoDeConsultaExameDtoToTipoDeConsultaExame(dto))),
      catchError(this.handleError)
    );
  }

  // Obter um tipo de consulta/exame por ID
  getTipoDeConsultaExameById(id: number): Observable<TipoDeConsultaExame> {
    return this.http.get<TipoDeConsultaExameDTO>(`${this.apiUrl}/${id}`).pipe(
      map(dto => this.mapTipoDeConsultaExameDtoToTipoDeConsultaExame(dto)),
      catchError(this.handleError)
    );
  }

  // Criar um novo tipo de consulta/exame
  criarTipoDeConsultaExame(tipoDto: CreateTipoDeConsultaExameDTO): Observable<TipoDeConsultaExame> {
    return this.http.post<TipoDeConsultaExameDTO>(this.apiUrl, tipoDto).pipe(
      map(dto => this.mapTipoDeConsultaExameDtoToTipoDeConsultaExame(dto)),
      catchError(this.handleError)
    );
  }

  // Atualizar um tipo de consulta/exame existente
  atualizarTipoDeConsultaExame(tipoDto: UpdateTipoDeConsultaExameDTO): Observable<TipoDeConsultaExame> {
    return this.http.put<TipoDeConsultaExameDTO>(`${this.apiUrl}/${tipoDto.id}`, tipoDto).pipe(
      map(dto => this.mapTipoDeConsultaExameDtoToTipoDeConsultaExame(dto)),
      catchError(this.handleError)
    );
  }

  // Deletar um tipo de consulta/exame
  deletarTipoDeConsultaExame(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Mapear TipoDeConsultaExameDTO para TipoDeConsultaExame
  private mapTipoDeConsultaExameDtoToTipoDeConsultaExame(dto: TipoDeConsultaExameDTO): TipoDeConsultaExame {
    return {
      id: dto.id,
      nome: dto.nome,
    };
  }

  // Tratamento de erros
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erro na requisição:', error);
    let errorMessage = 'Ocorreu um erro ao processar a solicitação.';
    if (error.status === 0) {
      errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
    } else if (error.status === 404) {
      errorMessage = 'Tipo de consulta/exame não encontrado.';
    } else if (error.status === 400) {
      errorMessage = error.error || 'Dados inválidos. Verifique os campos e tente novamente.';
    } else if (error.status === 409) {
      errorMessage = 'Um tipo de consulta/exame com este nome já existe.';
    }
    return throwError(() => new Error(errorMessage));
  }
}