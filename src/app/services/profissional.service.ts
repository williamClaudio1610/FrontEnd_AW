import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Profissional, CreateProfissionalDTO, ProfissionalDTO, UpdateProfissionalDTO } from '../models/profissional';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {
  private apiUrl = 'https://localhost:7273/api/profissional'; // Ajustado para a URL do seu backend

  constructor(private http: HttpClient) {}

  // Listar todos os profissionais
  getAllProfissionais(): Observable<Profissional[]> {
    return this.http.get<ProfissionalDTO[]>(this.apiUrl).pipe(
      map(profissionais => profissionais.map(dto => this.mapProfissionalDtoToProfissional(dto))),
      catchError(this.handleError)
    );
  }

  // Obter um profissional por ID
  getProfissionalById(id: number): Observable<Profissional> {
    return this.http.get<ProfissionalDTO>(`${this.apiUrl}/${id}`).pipe(
      map(dto => this.mapProfissionalDtoToProfissional(dto)),
      catchError(this.handleError)
    );
  }

  // Criar um novo profissional
  criarProfissional(profissionalDto: CreateProfissionalDTO): Observable<Profissional> {
    return this.http.post<ProfissionalDTO>(this.apiUrl, profissionalDto).pipe(
      map(dto => this.mapProfissionalDtoToProfissional(dto)),
      catchError(this.handleError)
    );
  }

  // Atualizar um profissional existente
  atualizarProfissional(profissionalDto: UpdateProfissionalDTO): Observable<Profissional> {
    return this.http.put<ProfissionalDTO>(`${this.apiUrl}/${profissionalDto.id}`, profissionalDto).pipe(
      map(dto => this.mapProfissionalDtoToProfissional(dto)),
      catchError(this.handleError)
    );
  }

  // Deletar um profissional
  deletarProfissional(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Mapear ProfissionalDTO para Profissional
  private mapProfissionalDtoToProfissional(dto: ProfissionalDTO): Profissional {
    return {
      id: dto.id,
      nome: dto.nome,
      especialidade: dto.especialidade,
      numeroLicenca: dto.numeroLicenca,
      email: dto.email,
      telemovel: dto.telemovel,
    };
  }
  // Tratamento de erros
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erro na requisição:', error);
    let errorMessage = 'Ocorreu um erro ao processar a solicitação.';
    if (error.status === 0) {
      errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
    } else if (error.status === 404) {
      errorMessage = 'Profissional não encontrado.';
    } else if (error.status === 400) {
      errorMessage = error.error || 'Dados inválidos. Verifique os campos e tente novamente.';
    } else if (error.status === 409) {
      errorMessage = 'Um profissional com este email ou número de licença já existe.';
    }
    return throwError(() => new Error(errorMessage));
  }
 
 

}
