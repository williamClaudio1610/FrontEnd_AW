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
import { ProfissionalService } from '../../../services/profissional.service';
import { TipoDeConsultaExameService } from '../../../services/tipo-de-consulta-exame.service';
import { TipoDeConsultaExameDTO } from '../../../models/tipo-de-consulta-exame';
import { Profissional, CreateProfissionalDTO, UpdateProfissionalDTO } from '../../../models/profissional';

@Component({
  selector: 'app-profissionais',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, ToastModule, ConfirmDialogModule, DropdownModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="profissionais-page">
      <p-toast></p-toast>
      <p-confirmDialog header="Confirmação" icon="pi pi-exclamation-triangle" [style]="{width: '400px'}"></p-confirmDialog>

      <h2>Profissionais</h2>
      <p>Lista de profissionais da clínica.</p>

      <div class="add-button">
        <button type="button" class="btn btn-success" (click)="showDialog()">Adicionar Profissional</button>
      </div>

      <p-dialog 
        [header]="editIndex !== null ? 'Editar Profissional' : 'Adicionar Profissional'" 
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
          <input #nomeInput pInputText id="nome" name="nome" [(ngModel)]="profissional.nome" [ngClass]="{'invalid': formSubmitted && !profissional.nome}" />
          <small *ngIf="formSubmitted && !profissional.nome" class="error-message">Nome é obrigatório.</small>
        </div>
        <div class="form-field">
          <label for="tipoDeConsultaExameId">Tipo de Consulta/Exame *</label>
          <p-dropdown 
            id="tipoDeConsultaExameId" 
            name="tipoDeConsultaExameId" 
            [options]="tiposDeConsultaExame" 
            [(ngModel)]="profissional.tipoDeConsultaExameId" 
            optionLabel="nome" 
            optionValue="id" 
            placeholder="Selecione um tipo" 
            [ngClass]="{'invalid': formSubmitted && !profissional.tipoDeConsultaExameId}" 
          />
          <small *ngIf="formSubmitted && !profissional.tipoDeConsultaExameId" class="error-message">Tipo de Consulta/Exame é obrigatório.</small>
        </div>
        <div class="form-field">
          <label for="numeroLicenca">Nº Licença *</label>
          <input pInputText id="numeroLicenca" name="numeroLicenca" [(ngModel)]="profissional.numeroLicenca" [ngClass]="{'invalid': formSubmitted && !profissional.numeroLicenca}" />
          <small *ngIf="formSubmitted && !profissional.numeroLicenca" class="error-message">Nº Licença é obrigatório.</small>
        </div>
        <div class="form-field">
          <label for="telefone">Telemóvel *</label>
          <input pInputText id="telefone" name="telefone" [(ngModel)]="profissional.telefone" [ngClass]="{'invalid': formSubmitted && !profissional.telefone}" />
          <small *ngIf="formSubmitted && !profissional.telefone" class="error-message">Telemóvel é obrigatório.</small>
        </div>
        <div class="form-field">
          <label for="email">E-mail *</label>
          <input pInputText id="email" name="email" [(ngModel)]="profissional.email" [ngClass]="{'invalid': formSubmitted && !profissional.email}" />
          <small *ngIf="formSubmitted && !profissional.email" class="error-message">E-mail é obrigatório.</small>
        </div>
        <ng-template pTemplate="footer">
          <p-button label="Cancelar" severity="secondary" (onClick)="displayDialog = false" styleClass="p-button-text" />
          <p-button label="Salvar" severity="success" (onClick)="saveProfissional()" styleClass="p-button-raised" />
        </ng-template>
      </p-dialog>

      <table class="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Nº Licença</th>
            <th>Especialidade - Tipo de Consulta/Exame</th>
            <th>Telemóvel</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of profissionais; let i = index">
            <td>{{ p.id }}</td>
            <td>{{ p.nome }}</td>
            <td>{{ p.numeroLicenca }}</td>
            <td>{{ p.tipoDeConsultaExameNome }}</td>
            <td>{{ p.telefone }}</td>
            <td>{{ p.email }}</td>
            <td>
              <button class="action-button" title="Editar" (click)="editProfissional(i)">
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
        <p class="no-data">Nenhum profissional encontrado.</p>
      </ng-template>
      <p *ngIf="erro" class="erro-msg">{{ erro }}</p>
    </div>
  `,
  styles: [`
    .profissionais-page {
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

    .form-field input, .form-field p-dropdown {
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
export class ProfissionaisComponent implements OnInit {
  displayDialog: boolean = false;
  profissional: Profissional = { id: 0, nome: '', numeroLicenca: '', tipoDeConsultaExameId: 0, tipoDeConsultaExameNome: '', telefone: '', email: '' };
  profissionais: Profissional[] = [];
  editIndex: number | null = null;
  formSubmitted: boolean = false;
  erro: string | null = null;
  tiposDeConsultaExame: TipoDeConsultaExameDTO[] = [];

  @ViewChild('nomeInput') nomeInput!: ElementRef;

  constructor(
    private profissionalService: ProfissionalService,
    private tipoDeConsultaExameService: TipoDeConsultaExameService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadProfissionais();
    this.loadTiposDeConsultaExame();
  }

  loadProfissionais() {
    this.profissionalService.getAllProfissionais().subscribe({
      next: (profissionais) => {
        this.profissionais = profissionais;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar profissionais: ' + err.message;
        console.error('Erro ao carregar profissionais:', err.message);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.message });
      }
    });
  }

  loadTiposDeConsultaExame() {
    this.tipoDeConsultaExameService.getAllTipos().subscribe({
      next: (tipos) => {
        this.tiposDeConsultaExame = tipos;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar tipos de consulta/exame: ' + err.message;
        console.error('Erro ao carregar tipos de consulta/exame:', err.message);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.message });
      }
    });
  }

  showDialog() {
    this.profissional = { id: 0, nome: '', numeroLicenca: '', tipoDeConsultaExameId: 0, tipoDeConsultaExameNome: '', telefone: '', email: '' };
    this.editIndex = null;
    this.formSubmitted = false;
    this.displayDialog = true;
  }

  editProfissional(index: number) {
    this.editIndex = index;
    this.profissional = { ...this.profissionais[index] };
    this.formSubmitted = false;
    this.displayDialog = true;
  }

  saveProfissional() {
    this.formSubmitted = true;

    if (!this.profissional.nome || !this.profissional.numeroLicenca || !this.profissional.tipoDeConsultaExameId || !this.profissional.telefone || !this.profissional.email) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    if (this.editIndex !== null) {
      // Atualizar profissional existente
      const updateProfissionalDTO: UpdateProfissionalDTO = {
        id: this.profissional.id,
        nome: this.profissional.nome,
        tipoDeConsultaExameId: this.profissional.tipoDeConsultaExameId,
        numeroLicenca: this.profissional.numeroLicenca,
        email: this.profissional.email,
        telefone: this.profissional.telefone
      };
      this.profissionalService.atualizarProfissional(updateProfissionalDTO).subscribe({
        next: (updatedProfissional) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Profissional atualizado com sucesso!' });
          this.loadProfissionais();
          this.displayDialog = false;
        },
        error: (err) => {
          this.erro = 'Erro ao atualizar profissional: ' + err.message;
          console.error('Erro ao atualizar profissional:', err.message);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.message });
        }
      });
    } else {
      // Criar novo profissional
      const createProfissionalDTO: CreateProfissionalDTO = {
        nome: this.profissional.nome,
        tipoDeConsultaExameId: this.profissional.tipoDeConsultaExameId,
        numeroLicenca: this.profissional.numeroLicenca,
        email: this.profissional.email,
        telefone: this.profissional.telefone
      };
      this.profissionalService.criarProfissional(createProfissionalDTO).subscribe({
        next: (newProfissional) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Profissional adicionado com sucesso!' });
          this.loadProfissionais();
          this.displayDialog = false;
        },
        error: (err) => {
          this.erro = 'Erro ao adicionar profissional: ' + err.message;
          console.error('Erro ao adicionar profissional:', err.message);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.message });
        }
      });
    }
  }

  confirmDelete(index: number) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o profissional ${this.profissionais[index].nome}?`,
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteProfissional(index);
      }
    });
  }

  deleteProfissional(index: number) {
    const profissionalId = this.profissionais[index].id;
    this.profissionalService.deletarProfissional(profissionalId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Profissional excluído com sucesso!' });
        this.loadProfissionais();
      },
      error: (err) => {
        this.erro = 'Erro ao eliminar profissional: ' + err.message;
        console.error('Erro ao eliminar profissional:', err.message);
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
    this.profissional = { id: 0, nome: '', numeroLicenca: '', tipoDeConsultaExameId: 0, tipoDeConsultaExameNome: '', telefone: '', email: '' };
  }
}