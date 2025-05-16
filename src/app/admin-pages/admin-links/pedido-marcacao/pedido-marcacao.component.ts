import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para diretivas como *ngIf e *ngFor
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'; // Para formulários reativos
import { FormsModule } from '@angular/forms'; // Para formulários template-driven
import { RouterModule } from '@angular/router'; // Para navegação, se necessário
import { CalendarModule } from 'primeng/calendar'; // Exemplo: PrimeNG Calendar
import { DropdownModule } from 'primeng/dropdown'; // Exemplo: PrimeNG Dropdown

@Component({
  selector: 'app-pedido-marcacao',
  standalone: true,
 template: `
    <div class="container">
      <h2 class="title">Pedido de Marcação</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="data">Data</label>
          <p-calendar
            formControlName="data"
            [showIcon]="true"
            placeholder="Selecione a data"
          ></p-calendar>
        </div>
        <div class="form-group">
          <label for="tipo">Tipo</label>
          <p-dropdown
            formControlName="tipo"
            [options]="tipos"
            placeholder="Selecione o tipo"
          ></p-dropdown>
        </div>
        <button type="submit" class="btn btn-primary">Enviar</button>
      </form>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .title {
        text-align: center;
        margin-bottom: 20px;
        font-size: 24px;
        color: #333;
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #555;
      }
      .btn {
        display: block;
        width: 100%;
        padding: 10px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn:hover {
        background-color: #0056b3;
      }
    `,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CalendarModule,
    DropdownModule,
  ],
})
export class PedidoMarcacaoComponent {
  form;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      data: [''],
      tipo: [''],
    });
  }

  tipos = [
    { label: 'Consulta', value: 'consulta' },
    { label: 'Exame', value: 'exame' },
  ];


  onSubmit() {
    console.log(this.form.value);
  }
}