import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <div class="dashboard-page">
      <h2>Dashboard</h2>
      <p>Bem-vindo ao painel de administração! Aqui você pode visualizar estatísticas e resumos.</p>
      <div class="stats">
        <div class="stat-card">
          <h3>Total de Produtos</h3>
          <p>150</p>
        </div>
        <div class="stat-card">
          <h3>Total de Clientes</h3>
          <p>320</p>
        </div>
        <div class="stat-card">
          <h3>Total de Funcionários</h3>
          <p>25</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 20px;
    }
    .stats {
      display: flex;
      gap: 20px;
      margin-top: 20px;
    }
    .stat-card {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      flex: 1;
      text-align: center;
    }
    .stat-card h3 {
      margin: 0 0 10px;
      font-size: 1.2rem;
      color: #333;
    }
    .stat-card p {
      margin: 0;
      font-size: 1.5rem;
      font-weight: bold;
      color: #60a5fa;
    }
  `]
})
export class DashboardComponent {}