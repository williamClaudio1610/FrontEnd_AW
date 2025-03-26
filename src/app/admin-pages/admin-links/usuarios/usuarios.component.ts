import { Component, ViewChild, ElementRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="usuarios-page">
      <p-toast></p-toast>
      <p-confirmDialog header="Confirmação" icon="pi pi-exclamation-triangle"></p-confirmDialog>

      <h2>Usuários</h2>
      <p>Lista de Usuários</p>

      <div class="add-button">
        <button type="button" class="btn btn-success" (click)="showDialog()">Adicionar Usuário</button>
      </div>

      <p-dialog 
        [header]="editIndex !== null ? 'Editar Usuário' : 'Adicionar Usuário'" 
        [(visible)]="displayDialog" 
        [modal]="true" 
        [style]="{width: '400px'}" 
        [draggable]="false" 
        [resizable]="false" 
        (onHide)="onDialogHide()" 
        (onShow)="onDialogShow()"
      >
        <div class="form-field">
          <label for="nome">Nome *</label>
          <input #nomeInput pInputText id="nome" [(ngModel)]="usuario.nome" [ngClass]="{'invalid': formSubmitted && !usuario.nome}" />
          <small *ngIf="formSubmitted && !usuario.nome" class="error-message">Nome é obrigatório.</small>
        </div>
        <div class="form-field">
          <label for="email">E-mail *</label>
          <input #nomeInput pInputText id="nome" [(ngModel)]="usuario.email" [ngClass]="{'invalid': formSubmitted && !usuario.email}" />
          <small *ngIf="formSubmitted && !usuario.email" class="error-message">E-mail é obrigatório.</small>
        </div>
        <div class="form-field">
          <label for="cargo">Cargo *</label>
          <input pInputText id="cargo" [(ngModel)]="usuario.cargo" [ngClass]="{'invalid': formSubmitted && !usuario.cargo}" />
          <small *ngIf="formSubmitted && !usuario.cargo" class="error-message">Cargo é obrigatório.</small>
        </div>
        <div class="form-field">
          <label for="departamento">Departamento *</label>
          <p-dropdown
            id="departamento"
            [options]="departamentos"
            [(ngModel)]="usuario.departamento"
            placeholder="Selecione um departamento"
            [ngClass]="{'invalid': formSubmitted && !usuario.departamento}"
          ></p-dropdown>
          <small *ngIf="formSubmitted && !usuario.departamento" class="error-message">Departamento é obrigatório.</small>
        </div>
        <p-footer>
          <p-button label="Salvar" severity="success" (onClick)="saveUsuario()" />
          <p-button label="Cancelar" severity="secondary" (onClick)="displayDialog = false" />
        </p-footer>
      </p-dialog>

      <table class="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Cargo</th>
            <th>Departamento</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of usuarios; let i = index">
            <td>{{ u.id }}</td>
            <td>{{ u.nome }}</td>
            <td>{{ u.cargo }}</td>
            <td>{{ u.departamento }}</td>
            <td>{{ u.tipo }}</td>
            <td>
              <button class="action-button" title="Editar" (click)="editUsuario(i)">
                <i class="pi pi-pencil"></i>
              </button>
              <button class="action-button" title="Excluir" (click)="confirmDelete(i)">
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .usuarios-page {
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 10px;
    }

    p {
      color: #6b7280;
      margin-bottom: 20px;
    }

    .add-button {
      margin-bottom: 20px;
    }

    .add-button .btn-success {
      font-size: 1rem;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

    .employee-table {
      width: 100%;
      border-collapse: collapse;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .employee-table th,
    .employee-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    .employee-table th {
      background-color: #f1f5f9;
      color: #374151;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;
    }

    .employee-table td {
      color: #1f2937;
      font-size: 0.9rem;
    }

    .employee-table tr:hover {
      background-color: #f9fafb;
    }

    .action-button {
      border: none;
      background: none;
      cursor: pointer;
      margin-right: 12px;
      font-size: 1.2rem;
      color: #6b7280;
      transition: color 0.3s ease;
    }

    .action-button:hover i.pi-pencil {
      color: #3b82f6;
    }

    .action-button:hover i.pi-trash {
      color: #ef4444;
    }

    .form-field {
      margin-bottom: 20px;
    }

    .form-field label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #374151;
    }

    .form-field input,
    .form-field p-dropdown {
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .invalid {
      border: 1px solid #ef4444 !important;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 4px;
      display: block;
    }

    :host ::ng-deep .p-dialog {
      z-index: 1000 !important;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    :host ::ng-deep .p-dialog .p-dialog-header {
      background-color: #f9fafb;
      color: #1f2937;
      font-weight: 600;
      border-bottom: 1px solid #e5e7eb;
    }

    :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 20px;
      background-color: #fff;
    }

    :host ::ng-deep .p-dialog .p-dialog-footer {
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class UsuariosComponent {
  displayDialog: boolean = false;
  usuario: any = { id: 0, nome: '', cargo: '', departamento: '' };
  usuarios = [
    { id: 1, nome: 'Carlos Mendes', cargo: 'Gerente', departamento: 'Vendas', tipo: 'Normal' },
    { id: 2, nome: 'Ana Costa', cargo: 'Analista', departamento: 'TI' , tipo: 'Normal'},
    { id: 3, nome: 'João Silva', cargo: 'Analista', departamento: 'TI' , tipo: 'Normal'},
  ];
  departamentos = ['Vendas', 'TI', 'RH', 'Marketing'];
  editIndex: number | null = null;
  formSubmitted: boolean = false;

  @ViewChild('nomeInput') nomeInput!: ElementRef;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  showDialog() {
    this.usuario = { id: this.usuarios.length + 1, nome: '', cargo: '', departamento: '', tipo: '' };
    this.editIndex = null;
    this.formSubmitted = false;
    this.displayDialog = true;
  }

  editUsuario(index: number) {
    this.editIndex = index;
    this.usuario = { ...this.usuarios[index] };
    this.formSubmitted = false;
    this.displayDialog = true;
  }

  saveUsuario() {
    this.formSubmitted = true;

    if (!this.usuario.nome || !this.usuario.cargo || !this.usuario.departamento) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    const nomeRegex = /^[a-zA-Z\s]+$/;
    if (!nomeRegex.test(this.usuario.nome)) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome deve conter apenas letras e espaços.' });
      return;
    }

    if (this.editIndex !== null) {
      this.usuarios[this.editIndex] = { ...this.usuario };
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado com sucesso!' });
    } else {
      this.usuarios.push({ ...this.usuario });
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário adicionado com sucesso!' });
    }
    this.displayDialog = false;
  }

  confirmDelete(index: number) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o usuário ${this.usuarios[index].nome}?`,
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteUsuario(index);
      }
    });
  }

  deleteUsuario(index: number) {
    this.usuarios.splice(index, 1);
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído com sucesso!' });
  }

  onDialogShow() {
    if (this.nomeInput) {
      this.nomeInput.nativeElement.focus();
    }
  }

  onDialogHide() {
    this.formSubmitted = false;
    this.usuario = { id: 0, nome: '', cargo: '', departamento: '' };
  }
}