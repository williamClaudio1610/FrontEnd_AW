import { Component } from '@angular/core';

@Component({
  selector: 'app-profissionais',
  standalone: true,
  imports: [],
  template: `
    <div class="profissionais-page">
      <h2>Profissionais</h2>
      <p>Lista de profissionais da clinica.</p>
      <table class="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Especialidade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Carlos Mendes</td>
            <td>Gerente</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Ana Costa</td>
            <td>Analista</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .funcionarios-page {
      padding: 20px;
    }
    .employee-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .employee-table th, .employee-table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .employee-table th {
      background-color: #f1f5f9;
      color: #333;
    }
    .employee-table tr:hover {
      background-color: #f9fafb;
    }
  `]
})
export class ProfissionaisComponent {}