import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuarioService } from '../../../services/usuario.service';
import { CreateUserDTO, UpdateUserDTO, Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="usuarios-page">
      <p-toast></p-toast>
      <p-confirmDialog header="Confirmação" icon="pi pi-exclamation-triangle" [style]="{width: '400px'}"></p-confirmDialog>

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
          <label for="fotografia">Fotografia *</label>
          <input pInputText id="fotografia" name="fotografia" [(ngModel)]="usuario.fotografia" [ngClass]="{'invalid': formSubmitted && !usuario.fotografia}" />
          <small *ngIf="formSubmitted && !usuario.fotografia" class="error-message">Fotografia é obrigatória.</small>
        </div>
        <div class="form-field">
          <label for="nome">Nome *</label>
          <input #nomeInput pInputText id="nome" name="nome" [(ngModel)]="usuario.nome" [ngClass]="{'invalid': formSubmitted && !usuario.nome}" />
          <small *ngIf="formSubmitted && !usuario.nome" class="error-message">Nome é obrigatório.</small>
        </div>
        <div class="form-field">
          <label for="email">E-mail *</label>
          <input pInputText id="email" name="email" [(ngModel)]="usuario.email" [ngClass]="{'invalid': formSubmitted && !usuario.email}" />
          <small *ngIf="formSubmitted && !usuario.email" class="error-message">E-mail é obrigatório.</small>
        </div>
        <div class="form-field" *ngIf="editIndex === null">
          <label for="senha">Senha *</label>
          <input pInputText type="password" id="senha" name="senha" [(ngModel)]="senha" [ngClass]="{'invalid': formSubmitted && !senha && editIndex === null}" />
          <small *ngIf="formSubmitted && !senha && editIndex === null" class="error-message">Senha é obrigatória.</small>
        </div>
        <div class="form-field">
          <label for="telemovel">Telemóvel *</label>
          <input pInputText id="telemovel" name="telemovel" [(ngModel)]="usuario.telemovel" [ngClass]="{'invalid': formSubmitted && !usuario.telemovel}" />
          <small *ngIf="formSubmitted && !usuario.telemovel" class="error-message">Telemóvel é obrigatório.</small>
        </div>
        <div class="form-field">
          <label for="morada">Morada *</label>
          <input pInputText id="morada" name="morada" [(ngModel)]="usuario.morada" [ngClass]="{'invalid': formSubmitted && !usuario.morada}" />
          <small *ngIf="formSubmitted && !usuario.morada" class="error-message">Morada é obrigatória.</small>
        </div>
        <div class="form-field">
          <label for="dataNascimento">Data de Nascimento *</label>
          <input pInputText id="dataNascimento" name="dataNascimento" type="date" [(ngModel)]="usuario.dataNascimento" [ngClass]="{'invalid': formSubmitted && !usuario.dataNascimento}" />
          <small *ngIf="formSubmitted && !usuario.dataNascimento" class="error-message">Data de nascimento é obrigatória.</small>
        </div>
        <div class="form-field">
          <label for="genero">Gênero *</label>
          <select id="genero" name="genero" [(ngModel)]="usuario.genero" [ngClass]="{'invalid': formSubmitted && !usuario.genero}">
            <option value="">Selecione o gênero</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
          <small *ngIf="formSubmitted && !usuario.genero" class="error-message">Gênero é obrigatório.</small>
        </div>
        <div class="form-field">
          <label for="perfil">Perfil *</label>
          <select id="perfil" name="perfil" [(ngModel)]="usuario.perfil" [ngClass]="{'invalid': formSubmitted && !usuario.perfil}">
            <option value="">Selecione um perfil</option>
            <option value="Administrador">Administrador</option>
            <option value="Utente Registado">Utente Registado</option>
            <option value="Administrativo">Administrativo</option>
            <option value="UtenteAnónimo">Utente Anónimo</option>
          </select>
          <small *ngIf="formSubmitted && !usuario.perfil" class="error-message">Perfil é obrigatório.</small>
        </div>
        <ng-template pTemplate="footer">
          <p-button label="Cancelar" severity="secondary" (onClick)="displayDialog = false" styleClass="p-button-text" />
          <p-button label="Salvar" severity="success" (onClick)="saveUsuario()" styleClass="p-button-raised" />
        </ng-template>
      </p-dialog>

      <table class="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número Utente</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telemóvel</th>
            <th>Morada</th>
            <th>Data de Nascimento</th>
            <th>Gênero</th>
            <th>Perfil</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of usuarios; let i = index">
            <td>{{ u.id }}</td>
            <td>{{ u.numeroUtente || '-' }}</td>
            <td>{{ u.nome }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.telemovel || '-' }}</td>
            <td>{{ u.morada || '-' }}</td>
            <td>{{ u.dataNascimento ? (u.dataNascimento | date:'dd-MM-yyyy') : '-' }}</td>
            <td>{{ u.genero || '-' }}</td>
            <td>{{ u.perfil || '-' }}</td>
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
      <ng-template #noData>
        <p class="no-data">Nenhum usuário encontrado.</p>
      </ng-template>
      <p *ngIf="erro" class="erro-msg">{{ erro }}</p>
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
    .form-field select {
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      font-size: 0.9rem;
      border: 1px solid #e5e7eb;
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
export class UsuariosComponent implements OnInit {
  displayDialog: boolean = false;
  usuario: Usuario = { id: 0, numeroUtente: '', nome: '', email: '', perfil: '', token: undefined, telemovel: '', morada: '', dataNascimento: new Date().toISOString().split('T')[0], genero: '', fotografia: '' };
  usuarios: Usuario[] = [];
  editIndex: number | null = null;
  formSubmitted: boolean = false;
  erro: string | null = null;
  senha: string = '';

  @ViewChild('nomeInput') nomeInput!: ElementRef;

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.usuarioService.getAllUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar usuários: ' + err.message;
        console.error('Erro ao carregar usuários:', err.message);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.message });
      }
    });
  }

  parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  showDialog() {
    this.usuario = { id: 0, numeroUtente: '', nome: '', email: '', perfil: '', token: undefined, telemovel: '', morada: '', dataNascimento: new Date().toISOString().split('T')[0], genero: '', fotografia: '' };
    this.senha = '';
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

    if (!this.usuario.fotografia || !this.usuario.nome || !this.usuario.email || !this.usuario.telemovel || !this.usuario.morada || !this.usuario.dataNascimento || !this.usuario.genero || !this.usuario.perfil) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    if (this.editIndex === null && !this.senha) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A senha é obrigatória para novos usuários.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuario.email)) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'E-mail inválido.' });
      return;
    }

    const parsedDataNascimento = this.parseDate(this.usuario.dataNascimento);

    if (!parsedDataNascimento) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Data de nascimento inválida.' });
      return;
    }

    if (this.editIndex !== null) {
      const updateDTO: UpdateUserDTO = {
        id: this.usuario.id,
        nome: this.usuario.nome,
        email: this.usuario.email,
        perfil: this.usuario.perfil,
        fotografia: this.usuario.fotografia,
        dataNascimento: parsedDataNascimento,
        genero: this.usuario.genero,
        telemovel: this.usuario.telemovel,
        morada: this.usuario.morada,
        senhaHash: this.senha || undefined,
      };
      this.usuarioService.updateUsuario(updateDTO).subscribe({
        next: (updatedUser: Usuario) => {
          this.usuarios[this.editIndex!] = updatedUser;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado com sucesso!' });
          this.loadUsuarios();
          this.displayDialog = false;
        },
        error: (err) => {
          this.erro = `Erro ao atualizar usuário: ${err.error?.message || (typeof err.error === 'object' ? JSON.stringify(err.error) : err.message)}`;
          console.error('Erro ao atualizar usuário:', err);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || (typeof err.error === 'object' ? JSON.stringify(err.error) : err.message) });
        }
      });
    } else {
      const createUserDTO: CreateUserDTO = {
        fotografia: this.usuario.fotografia,
        nome: this.usuario.nome,
        email: this.usuario.email,
        senhaHash: this.senha,
        perfil: this.usuario.perfil,
        telemovel: this.usuario.telemovel,
        morada: this.usuario.morada,
        dataNascimento: this.parseDate(this.usuario.dataNascimento) || undefined,
        genero: this.usuario.genero,
      };
      this.usuarioService.cadastrarUsuario(createUserDTO).subscribe({
        next: (newUser: Usuario) => {
          this.usuarios.push(newUser);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário adicionado com sucesso!' });
          this.loadUsuarios();
          this.displayDialog = false;
        },
        error: (err) => {
          this.erro = 'Erro ao adicionar usuário: ' + (err.error?.message || (typeof err.error === 'object' ? JSON.stringify(err.error) : err.message));
          console.error('Erro ao adicionar usuário:', err);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || (typeof err.error === 'object' ? JSON.stringify(err.error) : err.message) });
        }
      });
    }
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
    const usuarioId = this.usuarios[index].id;
    this.usuarioService.deleteUsuario(usuarioId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído com sucesso!' });
        this.loadUsuarios();
      },
      error: (err) => {
        this.erro = 'Erro ao eliminar usuário: ' + err.message;
        console.error('Erro ao eliminar usuário:', err.message);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.message });
      }
    });
  }

  onDialogShow() {
    if (this.displayDialog && this.nomeInput && !document.activeElement) {
      this.nomeInput.nativeElement.focus();
    }
  }

  onDialogHide() {
    this.formSubmitted = false;
    this.usuario = { id: 0, numeroUtente: '', nome: '', email: '', perfil: '', token: undefined, telemovel: '', morada: '', dataNascimento: new Date().toISOString().split('T')[0], genero: '', fotografia: '' };
    this.senha = '';
  }
}