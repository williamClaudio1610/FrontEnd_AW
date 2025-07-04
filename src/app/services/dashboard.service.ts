import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashBoardDTO {
  nome: string;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://localhost:7273/api/Dashboard';

  constructor(private http: HttpClient) { }

  getActosClinicosMaisPedidos(top: number = 10): Observable<DashBoardDTO[]> {
    return this.http.get<DashBoardDTO[]>(`${this.apiUrl}/actosclinicos-mais-pedidos?top=${top}`);
  }

  getProfissionaisMaisSolicitados(top: number = 10): Observable<DashBoardDTO[]> {
    return this.http.get<DashBoardDTO[]>(`${this.apiUrl}/profissionais-mais-solicitados?top=${top}`);
  }

  getSubsistemasMaisUsados(top: number = 10): Observable<DashBoardDTO[]> {
    return this.http.get<DashBoardDTO[]>(`${this.apiUrl}/subsistemas-mais-usados?top=${top}`);
  }

  getUsuariosComMaisPedidos(top: number = 10): Observable<DashBoardDTO[]> {
    return this.http.get<DashBoardDTO[]>(`${this.apiUrl}/usuarios-mais-pedidos?top=${top}`);
  }
}