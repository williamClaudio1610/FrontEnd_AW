import { Component, OnInit } from '@angular/core';
import { DashboardService, DashBoardDTO } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ProgressBarModule, TableModule, BadgeModule],
  template: `
    <div class="container-fluid p-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="text-center">
            <h1 class="display-4 text-primary mb-2">📊 Dashboard Administrativo</h1>
            <p class="lead text-muted">Visão geral das estatísticas e métricas do sistema</p>
          </div>
        </div>
      </div>

      <!-- Cards de Resumo -->
      <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-3">
          <p-card styleClass="h-100">
            <ng-template pTemplate="header">
              <div class="d-flex align-items-center justify-content-center p-3 bg-primary text-white">
                <i class="fas fa-hospital fa-2x"></i>
              </div>
            </ng-template>
            <ng-template pTemplate="content">
              <div class="text-center">
                <h3 class="text-primary mb-2">{{ totalActosClinicos }}</h3>
                <p class="text-muted mb-0">Actos Clínicos</p>
                <small class="text-muted">Total de pedidos</small>
              </div>
            </ng-template>
          </p-card>
        </div>

        <div class="col-xl-3 col-md-6 mb-3">
          <p-card styleClass="h-100">
            <ng-template pTemplate="header">
              <div class="d-flex align-items-center justify-content-center p-3 bg-success text-white">
                <i class="fas fa-user-md fa-2x"></i>
              </div>
            </ng-template>
            <ng-template pTemplate="content">
              <div class="text-center">
                <h3 class="text-success mb-2">{{ totalProfissionais }}</h3>
                <p class="text-muted mb-0">Profissionais</p>
                <small class="text-muted">Total de solicitações</small>
              </div>
            </ng-template>
          </p-card>
        </div>

        <div class="col-xl-3 col-md-6 mb-3">
          <p-card styleClass="h-100">
            <ng-template pTemplate="header">
              <div class="d-flex align-items-center justify-content-center p-3 bg-warning text-white">
                <i class="fas fa-building fa-2x"></i>
              </div>
            </ng-template>
            <ng-template pTemplate="content">
              <div class="text-center">
                <h3 class="text-warning mb-2">{{ totalSubsistemas }}</h3>
                <p class="text-muted mb-0">Subsistemas</p>
                <small class="text-muted">Total de usos</small>
              </div>
            </ng-template>
          </p-card>
        </div>

        <div class="col-xl-3 col-md-6 mb-3">
          <p-card styleClass="h-100">
            <ng-template pTemplate="header">
              <div class="d-flex align-items-center justify-content-center p-3 bg-info text-white">
                <i class="fas fa-users fa-2x"></i>
              </div>
            </ng-template>
            <ng-template pTemplate="content">
              <div class="text-center">
                <h3 class="text-info mb-2">{{ totalUsuarios }}</h3>
                <p class="text-muted mb-0">Usuários</p>
                <small class="text-muted">Total de pedidos</small>
              </div>
            </ng-template>
          </p-card>
        </div>
      </div>

      <!-- Tabelas de Dados -->
      <div class="row">
        <!-- Actos Clínicos -->
        <div class="col-xl-6 col-lg-12 mb-4">
          <p-card header="🏥 Actos Clínicos Mais Pedidos (Top 10)" styleClass="h-100">
            <ng-template pTemplate="content">
              <div *ngIf="actosClinicos.length > 0; else loadingActos">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead class="table-light">
                      <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Progresso</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let item of actosClinicos; let i = index">
                        <td>
                          <p-badge [value]="(i + 1).toString()" severity="info"></p-badge>
                        </td>
                        <td>{{ item.nome }}</td>
                        <td>
                          <span class="badge bg-primary">{{ item.quantidade }}</span>
                        </td>
                        <td style="width: 200px;">
                          <p-progressBar 
                            [value]="(item.quantidade / maxActosClinicos) * 100" 
                            [showValue]="false">
                          </p-progressBar>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <ng-template #loadingActos>
                <div class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                  </div>
                  <p class="mt-2 text-muted">Carregando dados...</p>
                </div>
              </ng-template>
            </ng-template>
          </p-card>
        </div>

        <!-- Profissionais -->
        <div class="col-xl-6 col-lg-12 mb-4">
          <p-card header="👨‍⚕️ Profissionais Mais Solicitados (Top 10)" styleClass="h-100">
            <ng-template pTemplate="content">
              <div *ngIf="profissionais.length > 0; else loadingProfissionais">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead class="table-light">
                      <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Progresso</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let item of profissionais; let i = index">
                        <td>
                          <p-badge [value]="(i + 1).toString()" severity="success"></p-badge>
                        </td>
                        <td>{{ item.nome }}</td>
                        <td>
                          <span class="badge bg-success">{{ item.quantidade }}</span>
                        </td>
                        <td style="width: 200px;">
                          <p-progressBar 
                            [value]="(item.quantidade / maxProfissionais) * 100" 
                            [showValue]="false">
                          </p-progressBar>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <ng-template #loadingProfissionais>
                <div class="text-center py-4">
                  <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Carregando...</span>
                  </div>
                  <p class="mt-2 text-muted">Carregando dados...</p>
                </div>
              </ng-template>
            </ng-template>
          </p-card>
        </div>

        <!-- Subsistemas -->
        <div class="col-xl-6 col-lg-12 mb-4">
          <p-card header="🏛️ Subsistemas Mais Usados (Top 10)" styleClass="h-100">
            <ng-template pTemplate="content">
              <div *ngIf="subsistemas.length > 0; else loadingSubsistemas">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead class="table-light">
                      <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Progresso</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let item of subsistemas; let i = index">
                        <td>
                          <p-badge [value]="(i + 1).toString()" severity="warn"></p-badge>
                        </td>
                        <td>{{ item.nome }}</td>
                        <td>
                          <span class="badge bg-warning text-dark">{{ item.quantidade }}</span>
                        </td>
                        <td style="width: 200px;">
                          <p-progressBar 
                            [value]="(item.quantidade / maxSubsistemas) * 100" 
                            [showValue]="false">
                          </p-progressBar>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <ng-template #loadingSubsistemas>
                <div class="text-center py-4">
                  <div class="spinner-border text-warning" role="status">
                    <span class="visually-hidden">Carregando...</span>
                  </div>
                  <p class="mt-2 text-muted">Carregando dados...</p>
                </div>
              </ng-template>
            </ng-template>
          </p-card>
        </div>

        <!-- Usuários -->
        <div class="col-xl-6 col-lg-12 mb-4">
          <p-card header="👥 Usuários com Mais Pedidos (Top 10)" styleClass="h-100">
            <ng-template pTemplate="content">
              <div *ngIf="usuarios.length > 0; else loadingUsuarios">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead class="table-light">
                      <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Progresso</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let item of usuarios; let i = index">
                        <td>
                          <p-badge [value]="(i + 1).toString()" severity="info"></p-badge>
                        </td>
                        <td>{{ item.nome }}</td>
                        <td>
                          <span class="badge bg-info">{{ item.quantidade }}</span>
                        </td>
                        <td style="width: 200px;">
                          <p-progressBar 
                            [value]="(item.quantidade / maxUsuarios) * 100" 
                            [showValue]="false">
                          </p-progressBar>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <ng-template #loadingUsuarios>
                <div class="text-center py-4">
                  <div class="spinner-border text-info" role="status">
                    <span class="visually-hidden">Carregando...</span>
                  </div>
                  <p class="mt-2 text-muted">Carregando dados...</p>
                </div>
              </ng-template>
            </ng-template>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos customizados para o dashboard */
    .container-fluid {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      min-height: 100vh;
    }

    .display-4 {
      font-weight: 700;
    }

    .lead {
      font-size: 1.1rem;
    }

    /* Cards com hover effect */
    ::ng-deep .p-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    ::ng-deep .p-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
    }

    /* Progress bars customizados */
    ::ng-deep .p-progressbar {
      height: 8px;
      border-radius: 4px;
    }

    /* Badges customizados */
    ::ng-deep .p-badge {
      font-size: 0.75rem;
      font-weight: 600;
    }

    /* Tabelas responsivas */
    .table-responsive {
      border-radius: 8px;
      overflow: hidden;
    }

    .table th {
      font-weight: 600;
      background-color: #f8f9fa;
      border-bottom: 2px solid #dee2e6;
    }

    .table td {
      vertical-align: middle;
    }

    /* Spinners customizados */
    .spinner-border {
      width: 2rem;
      height: 2rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  actosClinicos: DashBoardDTO[] = [];
  profissionais: DashBoardDTO[] = [];
  subsistemas: DashBoardDTO[] = [];
  usuarios: DashBoardDTO[] = [];

  // Valores máximos para calcular progresso
  maxActosClinicos: number = 0;
  maxProfissionais: number = 0;
  maxSubsistemas: number = 0;
  maxUsuarios: number = 0;



  get totalActosClinicos(): number {
    return this.actosClinicos.reduce((acc, curr) => acc + curr.quantidade, 0);
  }
  get totalProfissionais(): number {
    return this.profissionais.reduce((acc, curr) => acc + curr.quantidade, 0);
  }
  get totalSubsistemas(): number {
    return this.subsistemas.reduce((acc, curr) => acc + curr.quantidade, 0);
  }
  get totalUsuarios(): number {
    return this.usuarios.reduce((acc, curr) => acc + curr.quantidade, 0);
  }

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    console.log('Dashboard: Iniciando carregamento dos dados...');
    
    this.dashboardService.getActosClinicosMaisPedidos(10).subscribe({
      next: (data) => {
        console.log('Actos Clínicos recebidos:', data);
        this.actosClinicos = data;
        this.maxActosClinicos = data.length > 0 ? Math.max(...data.map(d => d.quantidade)) : 0;
      },
      error: (error) => {
        console.error('Erro ao carregar actos clínicos:', error);
      }
    });

    this.dashboardService.getProfissionaisMaisSolicitados(10).subscribe({
      next: (data) => {
        console.log('Profissionais recebidos:', data);
        this.profissionais = data;
        this.maxProfissionais = data.length > 0 ? Math.max(...data.map(d => d.quantidade)) : 0;
      },
      error: (error) => {
        console.error('Erro ao carregar profissionais:', error);
      }
    });

    this.dashboardService.getSubsistemasMaisUsados(10).subscribe({
      next: (data) => {
        console.log('Subsistemas recebidos:', data);
        this.subsistemas = data;
        this.maxSubsistemas = data.length > 0 ? Math.max(...data.map(d => d.quantidade)) : 0;
      },
      error: (error) => {
        console.error('Erro ao carregar subsistemas:', error);
      }
    });

    this.dashboardService.getUsuariosComMaisPedidos(10).subscribe({
      next: (data) => {
        console.log('Usuários recebidos:', data);
        this.usuarios = data;
        this.maxUsuarios = data.length > 0 ? Math.max(...data.map(d => d.quantidade)) : 0;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    });
  }

  getTop10(data: DashBoardDTO[]): DashBoardDTO[] {
    return data.slice(0, 10);
  }
}