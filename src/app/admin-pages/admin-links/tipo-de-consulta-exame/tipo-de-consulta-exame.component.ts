import { Component } from '@angular/core';

@Component({
  selector: 'app-tipo-de-consulta-exame',
  standalone: true,
  imports: [],
  template: `
    <div class="tipo-de-consulta-exame-page">
      <h2>Tipos de Consulta/Exame</h2>
      <p>Lista de tipos de consulta e exame disponíveis.</p>
      <table class="tipo-de-consulta-exame-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Duração (min)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Consulta de Cardiologia</td>
            <td>Consulta</td>
            <td>30</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Exame de Sangue</td>
            <td>Exame</td>
            <td>15</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .tipo-de-consulta-exame-page {
      padding: 20px;
    }
    .tipo-de-consulta-exame-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .tipo-de-consulta-exame-table th, .tipo-de-consulta-exame-table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .tipo-de-consulta-exame-table th {
      background-color: #f1f5f9;
      color: #333;
    }
    .tipo-de-consulta-exame-table tr:hover {
      background-color: #f9fafb;
    }
  `]
})
export class TipoDeConsultaExameComponent {}