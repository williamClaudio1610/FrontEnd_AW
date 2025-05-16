import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TipoDeConsultaExameService } from '../../../services/tipo-de-consulta-exame.service';
import { TipoDeConsultaExameDTO, CreateTipoDeConsultaExameDTO, UpdateTipoDeConsultaExameDTO } from '../../../models/tipo-de-consulta-exame';

@Component({
  selector: 'app-tipo-consulta-exame',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, ToastModule, ConfirmDialogModule, DropdownModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="tipos-consulta-exame-page">
      <p-toast></p-toast>
      <p-confirmDialog header="Confirmação" icon="pi pi-exclamation-triangle" [style]="{width: '400px'}"></p-confirmDialog>

      <h2>Tipos de Consulta/Exame</h2>
      <p>Lista de tipos de consulta/exame da clínica.</p>

      <div class="add-button">
        <button type="button" class="btn btn-success" (click)="showDialog()">Adicionar Tipo</button>
      </div>

      <p-dialog 
        [header]="editIndex !== null ? 'Editar Tipo' : 'Adicionar Tipo'" 
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
          <input #nomeInput pInputText id="nome" name="nome" [(ngModel)]="tipo.nome" [ngClass]="{'invalid': formSubmitted && !tipo.nome}" />
          <small *ngIf="formSubmitted && !tipo.nome" class="error-message">Nome é obrigatório.</small>
        </div>
        <ng-template pTemplate="footer">
          <p-button label="Cancelar" severity="secondary" (onClick)="displayDialog = false" styleClass="p-button-text" />
          <p-button label="Salvar" severity="success" (onClick)="saveTipo()" styleClass="p-button-raised" />
        </ng-template>
      </p-dialog>

      <table class="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of tipos; let i = index">
            <td>{{ t.id }}</td>
            <td>{{ t.nome }}</td>
            <td>
              <button class="action-button" title="Editar" (click)="editTipo(i)">
                <i class="pi pi-pencil"></i>
              </button>
              <button class="action-button" title="Excluir" (click)="confirmDelete(i)">
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <ng-template #noData>
        <p class="no-data">Nenhum tipo de consulta/exame encontrado.</p>
      </ng-template>
      <p *ngIf="erro" class="erro-msg">{{ erro }}</p>
    </div>
  `,
  styles: [`
    .tipos-consulta-exame-page {
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

    .form-field input {
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

    .no-data {
      margin-top: 15px;
      color: #666;
    }

    .erro-msg {
      color: red;
      margin-top: 15px;
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

    :host ::ng-deep .p-confirm-dialog {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    :host ::ng-deep .p-confirm-dialog .p-dialog-content {
      background-color: #fff;
      color: #1f2937;
      padding: 20px;
    }

    :host ::ng-deep .p-confirm-dialog .p-dialog-footer {
      padding: 16px;
      background-color: #f9fafb;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    :host ::ng-deep .p-confirm-dialog .p-button {
      margin-left: 8px;
    }
  `]
})
export class TipoDeConsultaExameComponent implements OnInit {
  displayDialog: boolean = false;
  tipo: TipoDeConsultaExameDTO = { id: 0, nome: '' };
  tipos: TipoDeConsultaExameDTO[] = [];
  editIndex: number | null = null;
  formSubmitted: boolean = false;
  erro: string | null = null;

  @ViewChild('nomeInput') nomeInput!: ElementRef;

  constructor(
    private tipoDeConsultaExameService: TipoDeConsultaExameService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadTipos();
  }

  loadTipos() {
    this.tipoDeConsultaExameService.getAllTipos().subscribe({
      next: (tipos) => {
        this.tipos = tipos;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar tipos de consulta/exame: ' + err.message;
        console.error('Erro ao carregar tipos:', err.message);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.message });
      }
    });
  }

  showDialog() {
    this.tipo = { id: 0, nome: '' };
    this.editIndex = null;
    this.formSubmitted = false;
    this.displayDialog = true;
  }

  editTipo(index: number) {
    this.editIndex = index;
    this.tipo = { ...this.tipos[index] };
    this.formSubmitted = false;
    this.displayDialog = true;
  }

  saveTipo() {
    this.formSubmitted = true;

    if (!this.tipo.nome) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Preencha o nome obrigatório.' });
    return;
  }

  if (this.editIndex !== null) {
    console.log('Dados enviados para atualização:', this.tipo); // Verifique este log
    const updateTipoDTO: UpdateTipoDeConsultaExameDTO = { id: this.tipo.id, nome: this.tipo.nome };
    this.tipoDeConsultaExameService.updateTipo(this.tipo.id, updateTipoDTO).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tipo atualizado com sucesso!' });
        this.loadTipos();
        this.displayDialog = false;
      },
      error: (err) => {
        this.erro = 'Erro ao atualizar tipo: ' + err.message;
        console.error('Erro ao atualizar tipo:', err.message);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.message });
      }
    });
    } else {
      // Criar novo tipo
      const createTipoDTO: CreateTipoDeConsultaExameDTO = { nome: this.tipo.nome };
      this.tipoDeConsultaExameService.createTipo(createTipoDTO).subscribe({
        next: (newTipo) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tipo adicionado com sucesso!' });
          this.loadTipos();
          this.displayDialog = false;
        },
        error: (err) => {
          this.erro = 'Erro ao adicionar tipo: ' + err.message;
          console.error('Erro ao adicionar tipo:', err.message);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.message });
        }
      });
    }
  }

  confirmDelete(index: number) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o tipo "${this.tipos[index].nome}"?`,
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteTipo(index);
      }
    });
  }

  deleteTipo(index: number) {
    const tipoId = this.tipos[index].id;
    this.tipoDeConsultaExameService.deleteTipo(tipoId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tipo excluído com sucesso!' });
        this.loadTipos();
      },
      error: (err) => {
        this.erro = 'Erro ao eliminar tipo: ' + err.message;
        console.error('Erro ao eliminar tipo:', err.message);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.message });
      }
    });
  }

  onDialogShow() {
    if (this.nomeInput) {
      this.nomeInput.nativeElement.focus();
    }
  }

  onDialogHide() {
    this.formSubmitted = false;
    this.tipo = { id: 0, nome: '' };
  }
}