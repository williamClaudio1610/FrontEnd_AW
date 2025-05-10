import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Adicionado para ngModel
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SubsistemaSaudeService } from '../../../services/subsistema-saude.service';
import { SubsistemaSaude, CreateSubsistemaSaudeDTO } from '../../../models/subsistema-saude';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-subsistema-saude',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, InputTextModule, FormsModule],
  template: `
    <div class="subsistema-saude-page">
      <h2>Subsistemas de Saúde</h2>
      <button type="button" class="btn btn-success" (click)="abrirDialogAdicionar()">Adicionar Subsistema</button>
      <p *ngIf="loading">Carregando subsistemas...</p>
      <table *ngIf="!loading && subsistemas.length > 0" class="subsistema-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let subsistema of subsistemas">
            <td>{{ subsistema.id }}</td>
            <td>{{ subsistema.nome }}</td>
            <td>{{ subsistema.descricao || 'Sem descrição' }}</td>
            <td>
              <button pButton pRipple icon="pi pi-pencil" (click)="abrirDialogEditar(subsistema)" style="margin-right: 5px"></button>
              <button pButton pRipple icon="pi pi-trash" (click)="abrirDialogEliminar(subsistema.id)" class="p-button-danger"></button>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="!loading && subsistemas.length === 0 && !erro" class="no-data">Nenhum subsistema encontrado.</p>
      <p *ngIf="erro" class="erro-msg">{{ erro }}</p>

      <!-- Diálogo para Adicionar/Editar -->
      <p-dialog header="{{ dialogHeader }}" [(visible)]="displayDialog" [modal]="true" [draggable]="false" [resizable]="false" (onHide)="onDialogHide()">
        <div class="p-fluid">
          <div class="p-field">
            <label for="nome">Nome</label>
            <input id="nome" name="nome" type="text" pInputText [(ngModel)]="subsistemaSelecionado.nome" required />
          </div>
          <div class="p-field">
            <label for="descricao">Descrição</label>
            <input id="descricao" name="descricao" type="text" pInputText [(ngModel)]="subsistemaSelecionado.descricao" />
          </div>

        </div>
        <ng-template pTemplate="footer">
          <button pButton pRipple label="Cancelar" icon="pi pi-times" (click)="fecharDialog()" class="p-button-secondary"></button>
          <button pButton pRipple label="Salvar" icon="pi pi-check" (click)="salvarSubsistema()" [disabled]="!subsistemaSelecionado.nome || !subsistemaSelecionado.descricao"></button>
        </ng-template>
      </p-dialog>

      <!-- Diálogo para Eliminar -->
      <p-dialog header="Confirmar Eliminação" [(visible)]="displayDialogEliminar" [modal]="true" [draggable]="false" [resizable]="false" (onHide)="fecharDialogEliminar()">
        <p>Tem certeza que deseja eliminar o subsistema "{{ subsistemaNomeEliminar }}"? Esta ação não pode ser desfeita.</p>
        <ng-template pTemplate="footer">
          <button pButton pRipple label="Não" icon="pi pi-times" (click)="fecharDialogEliminar()" class="p-button-secondary"></button>
          <button pButton pRipple label="Sim" icon="pi pi-check" (click)="eliminarSubsistema()" class="p-button-danger"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .subsistema-saude-page {
      padding: 20px;
    }
    .subsistema-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .subsistema-table th, .subsistema-table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .subsistema-table th {
      background-color: #f1f5f9;
      color: #333;
    }
    .subsistema-table tr:hover {
      background-color: #f9fafb;
    }
    .erro-msg {
      color: red;
      margin-top: 15px;
    }
    .no-data {
      margin-top: 15px;
      color: #666;
    }
    button {
      margin: 5px;
    }
    .p-fluid .p-field {
      margin-bottom: 1rem;
    }
  `]
})
export class SubsistemaSaudeComponent implements OnInit {
  subsistemas: SubsistemaSaude[] = [];
  loading: boolean = true;
  erro: string | null = null;
  displayDialog: boolean = false;
  displayDialogEliminar: boolean = false;
  subsistemaSelecionado: CreateSubsistemaSaudeDTO = { nome: '', descricao: ''};
  subsistemaIdEliminar: number | null = null;
  subsistemaNomeEliminar: string = '';

  constructor(
    private subsistemaSaudeService: SubsistemaSaudeService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarSubsistemas();
  }

  carregarSubsistemas(): void {
    this.loading = true;
    this.erro = null;
    this.subsistemaSaudeService.getAllSubsistemasSaude().subscribe({
      next: (subsistemas) => {
        this.subsistemas = subsistemas;
        this.loading = false;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar subsistemas: ' + err.message;
        this.loading = false;
        console.error('Erro ao carregar subsistemas:', err.message);
      }
    });
  }

  abrirDialogAdicionar(): void {
    this.subsistemaSelecionado = { nome: '', descricao: ''};
    this.dialogHeader = 'Adicionar Subsistema';
    this.displayDialog = true;
  }

  abrirDialogEditar(subsistema: SubsistemaSaude): void {
    this.subsistemaSelecionado = { ...subsistema, descricao: subsistema.descricao || '' };
    this.dialogHeader = 'Editar Subsistema';
    this.displayDialog = true;
  }

  abrirDialogEliminar(id: number): void {
    const subsistema = this.subsistemas.find(s => s.id === id);
    this.subsistemaIdEliminar = id;
    this.subsistemaNomeEliminar = subsistema?.nome || '';
    this.displayDialogEliminar = true;
  }

  fecharDialog(): void {
    this.displayDialog = false;
  }

  fecharDialogEliminar(): void {
    this.displayDialogEliminar = false;
    this.subsistemaIdEliminar = null;
    this.subsistemaNomeEliminar = '';
  }

  salvarSubsistema(): void {
    if (this.subsistemaSelecionado.nome && this.subsistemaSelecionado.descricao) {
      if ('id' in this.subsistemaSelecionado) {
        // Atualizar subsistema existente
        this.subsistemaSaudeService.atualizarSubsistemaSaude(this.subsistemaSelecionado as SubsistemaSaude).subscribe({
          next: () => {
            this.carregarSubsistemas();
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Subsistema atualizado!' });
            this.fecharDialog();
          },
          error: (err) => {
            this.erro = 'Erro ao atualizar subsistema: ' + err.message;
            console.error('Erro ao atualizar subsistema:', err.message);
          }
        });
      } else {
        // Adicionar novo subsistema
        this.subsistemaSaudeService.criarSubsistemaSaude(this.subsistemaSelecionado).subscribe({
          next: () => {
            this.carregarSubsistemas();
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Subsistema adicionado!' });
            this.fecharDialog();
          },
          error: (err) => {
            this.erro = 'Erro ao adicionar subsistema: ' + err.message;
            console.error('Erro ao adicionar subsistema:', err.message);
          }
        });
      }
    }
  }

  eliminarSubsistema(): void {
    if (this.subsistemaIdEliminar !== null) {
      this.subsistemaSaudeService.deletarSubsistemaSaude(this.subsistemaIdEliminar).subscribe({
        next: () => {
          this.carregarSubsistemas();
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Subsistema eliminado!' });
          this.fecharDialogEliminar();
        },
        error: (err) => {
          this.erro = 'Erro ao eliminar subsistema: ' + err.message;
          console.error('Erro ao eliminar subsistema:', err.message);
          this.fecharDialogEliminar();
        }
      });
    }
  }

  dialogHeader: string = '';
  onDialogHide(): void {
    this.subsistemaSelecionado = { nome: '', descricao: ''};
  }
}