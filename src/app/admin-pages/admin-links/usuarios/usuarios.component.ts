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
import { CreateUserDTO, UpdateUserDTO, Usuario, ChangeStatusDTO } from '../../../models/usuario';
import { firstValueFrom } from 'rxjs';

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
          <label for="fotografia">Fotografia</label>
          <div class="photo-upload-section">
            <div class="current-photo" *ngIf="usuario.fotografia || selectedFile">
              <img *ngIf="getCurrentPhotoUrl()" [src]="getCurrentPhotoUrl()" alt="Foto de Perfil" class="profile-photo-preview">
              <div *ngIf="!getCurrentPhotoUrl()" class="profile-photo-preview profile-icon-placeholder">
                <i class="pi pi-user"></i>
              </div>
            </div>
            <div class="upload-controls">
              <input type="file" id="photoUpload" (change)="onFileSelected($event)" accept="image/*" style="display: none;">
              <button type="button" pButton pRipple label="Selecionar Foto" icon="pi pi-upload" class="p-button-outlined" (click)="openFileSelector()"></button>
              <button *ngIf="selectedFile" type="button" pButton pRipple label="Remover" icon="pi pi-trash" class="p-button-outlined p-button-danger" (click)="removeSelectedFile()"></button>
            </div>
            <small class="text-muted">Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB</small>
          </div>
        </div>
        <div class="form-field">
          <label for="nome">Nome *</label>
          <input #nomeInput pInputText id="nome" name="nome" [(ngModel)]="usuario.nome" [ngClass]="{'invalid': formSubmitted && !usuario.nome}" />
          <small *ngIf="formSubmitted && !usuario.nome" class="error-message">Nome é obrigatório.</small>
        </div>
        <div class="form-field">
          <label for="numeroUtente">Número de Utente *</label>
          <input pInputText id="numeroUtente" name="numeroUtente" [(ngModel)]="usuario.numeroUtente" [ngClass]="{'invalid': formSubmitted && !usuario.numeroUtente}" />
          <small *ngIf="formSubmitted && !usuario.numeroUtente" class="error-message">Número de utente é obrigatório.</small>
        </div>
        <div class="form-field">
          <label for="email">E-mail *</label>
          <input pInputText id="email" name="email" [(ngModel)]="usuario.email" [ngClass]="{'invalid': formSubmitted && !usuario.email}" />
          <small *ngIf="formSubmitted && !usuario.email" class="error-message">E-mail é obrigatório.</small>
        </div>
        <div class="form-field" *ngIf="editIndex === null">
          <label for="senha">Senha *</label>
          <input pInputText type="password" id="senha" name="senha" [(ngModel)]="senha" (input)="checkPasswordStrength()" [ngClass]="{'invalid': formSubmitted && !senha}" />
          <div *ngIf="passwordStrength" class="password-strength">
            <small [ngClass]="getPasswordStrengthClass()">Força da senha: {{ getPasswordStrengthText() }}</small>
          </div>
          <small *ngIf="formSubmitted && !senha" class="error-message">Senha é obrigatória.</small>
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
            <option value="UtenteRegistado">UtenteRegistado</option>
            <option value="Administrativo">Administrativo</option>
            <option value="UtenteAnonimo">UtenteAnonimo</option>
            <option value="Profissional">Profissional</option>
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
            <th>Estado</th>
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
              <span [ngClass]="u.isBloqueado ? 'text-danger' : 'text-success'">
                {{ u.isBloqueado ? 'Bloqueado' : 'Ativo' }}
              </span>
            </td>
            <td>
              <button class="action-button" title="Editar" (click)="editUsuario(i)">
                <i class="pi pi-pencil"></i>
              </button>
              <button class="action-button" 
                      [title]="u.isBloqueado ? 'Desbloquear' : 'Bloquear'" 
                      (click)="toggleEstadoUsuario(i)">
                <i class="pi" [ngClass]="u.isBloqueado ? 'pi-lock-open' : 'pi-lock'" ></i>
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

    /* Estilos para upload de foto */
    .photo-upload-section {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      border: 2px dashed #e2e8f0;
      transition: all 0.3s ease;
    }

    .photo-upload-section:hover {
      border-color: #667eea;
      background: #f8fafc;
    }

    .current-photo {
      flex-shrink: 0;
    }

    .profile-photo-preview {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .profile-icon-placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: white;
    }

    .upload-controls {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .upload-controls button {
      max-width: 200px;
    }

    .upload-controls small {
      color: #6c757d;
      font-size: 0.85rem;
      margin-top: 5px;
    }

    /* Estilos para força da senha */
    .password-strength {
      margin-top: 4px;
    }

    .password-strength.weak {
      color: #ef4444;
    }

    .password-strength.medium {
      color: #f59e0b;
    }

    .password-strength.strong {
      color: #10b981;
    }

    @media (max-width: 768px) {
      .photo-upload-section {
        flex-direction: column;
        text-align: center;
      }

      .upload-controls {
        width: 100%;
      }

      .upload-controls button {
        max-width: none;
      }
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
  usuario: Usuario = {
    id: 0,
    numeroUtente: '',
    nome: '',
    email: '',
    perfil: '',
    telemovel: '',
    morada: '',
    dataNascimento: '',
    genero: '',
    fotografia: '',
    isBloqueado: false,
  };
  usuarios: Usuario[] = [];
  editIndex: number | null = null;
  formSubmitted: boolean = false;
  erro: string | null = null;
  senha: string = '';
  passwordStrength: string = '';

  // Propriedades para foto de perfil
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  @ViewChild('nomeInput') nomeInput!: ElementRef;

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

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
    this.usuario = { 
      id: 0, 
      numeroUtente: '', 
      nome: '', 
      email: '', 
      perfil: '', 
      telemovel: '', 
      morada: '', 
      dataNascimento: new Date().toISOString().split('T')[0], 
      genero: '', 
      isBloqueado: false,
      fotografia: '' 
    };
    this.senha = '';
    this.passwordStrength = '';
    this.selectedFile = null;
    this.previewUrl = null;
    this.editIndex = null;
    this.formSubmitted = false;
    this.displayDialog = true;
  }

  editUsuario(index: number) {
    this.editIndex = index;
    this.usuario = { ...this.usuarios[index] };
    // Ensure dataNascimento is in YYYY-MM-DD format
    if (this.usuario.dataNascimento) {
      this.usuario.dataNascimento = this.formatarDataParaEnvio(this.usuario.dataNascimento);
    }
    this.senha = ''; // Reset password field for updates
    this.passwordStrength = '';
    this.selectedFile = null; // Reset file selection
    this.previewUrl = null;
    this.formSubmitted = false;
    this.displayDialog = true;
  }

  // Métodos para validação de senha
  checkPasswordStrength() {
    if (!this.senha) {
      this.passwordStrength = '';
      return;
    }

    const hasLetters = /[a-zA-Z]/.test(this.senha);
    const hasNumbers = /[0-9]/.test(this.senha);
    const hasSpecial = /[^a-zA-Z0-9]/.test(this.senha);
    const length = this.senha.length;

    let strength = 0;
    if (length >= 8) strength++;
    if (length >= 12) strength++;
    if (hasLetters && hasNumbers) strength++;
    if (hasSpecial) strength++;

    if (strength <= 2) this.passwordStrength = 'weak';
    else if (strength === 3) this.passwordStrength = 'medium';
    else this.passwordStrength = 'strong';
  }

  getPasswordStrengthText(): string {
    switch (this.passwordStrength) {
      case 'weak': return 'Fraca';
      case 'medium': return 'Média';
      case 'strong': return 'Forte';
      default: return '';
    }
  }

  getPasswordStrengthClass(): string {
    return `password-strength ${this.passwordStrength}`;
  }

  // Métodos para upload de foto
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Por favor, selecione apenas arquivos de imagem.'
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'A imagem deve ter no máximo 5MB.'
        });
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  openFileSelector(): void {
    const fileInput = document.getElementById('photoUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  getCurrentPhotoUrl(): string {
    if (this.previewUrl) {
      return this.previewUrl;
    }
    if (this.usuario?.fotografia) {
      return 'https://localhost:7273' + (this.usuario.fotografia.startsWith('/') ? this.usuario.fotografia : `/Uploads/${this.usuario.fotografia}`);
    }
    return '';
  }

  formatarDataParaEnvio(dateString: string | Date): string {
    let date: Date;

    if (typeof dateString === 'string') {
      date = new Date(dateString);
    } else {
      date = dateString;
    }

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  async saveUsuario() {
    this.formSubmitted = true;

    // Validate required fields
    if (!this.usuario.nome || !this.usuario.email || !this.usuario.telemovel ||
      !this.usuario.morada || !this.usuario.dataNascimento || !this.usuario.genero ||
      !this.usuario.perfil || !this.usuario.numeroUtente || (this.editIndex === null && !this.senha)) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    // Validate password strength for new users
    if (this.editIndex === null && this.passwordStrength === 'weak') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A senha é muito fraca. Escolha uma senha mais forte.' });
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
      // Update existing user using UpdateUserDTO
      const updateDTO: UpdateUserDTO = {
        id: this.usuario.id,
        nome: this.usuario.nome,
        email: this.usuario.email,
        perfil: this.usuario.perfil,
        fotografia: this.selectedFile || undefined,
        dataNascimento: this.formatarDataParaEnvio(this.usuario.dataNascimento!),
        genero: this.usuario.genero,
        telemovel: this.usuario.telemovel,
        morada: this.usuario.morada,
        numeroUtente: this.usuario.numeroUtente,
        isBloqueado: this.usuario.isBloqueado
      };

      try {
        const updatedUser = await firstValueFrom(this.usuarioService.updateUsuario(updateDTO));
        this.usuarios[this.editIndex!] = updatedUser;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado com sucesso!' });
        this.loadUsuarios();
        this.displayDialog = false;
        this.selectedFile = null;
        this.previewUrl = null;
      } catch (err: any) {
        this.erro = `Erro ao atualizar usuário: ${err.message || 'Erro desconhecido'}`;
        console.error('Erro ao atualizar usuário:', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: this.erro });
      }
    } else {
      // Create new user
      const dataNascimentoFormatada = this.formatarDataParaEnvio(new Date(this.usuario.dataNascimento!));

      const formData = new FormData();
      if (this.selectedFile) {
        formData.append('Fotografia', this.selectedFile);
      }
      formData.append('Nome', this.usuario.nome);
      formData.append('Email', this.usuario.email);
      formData.append('SenhaHash', this.senha);
      formData.append('Perfil', this.usuario.perfil);
      formData.append('Telemovel', this.usuario.telemovel);
      formData.append('Morada', this.usuario.morada);
      formData.append('Genero', this.usuario.genero);
      formData.append('DataNascimento', dataNascimentoFormatada);
      formData.append('NumeroUtente', this.usuario.numeroUtente);

      try {
        const newUser = await firstValueFrom(this.usuarioService.cadastrarUsuario(formData));
        this.usuarios.push(newUser);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário adicionado com sucesso!' });
        this.loadUsuarios();
        this.displayDialog = false;
        this.selectedFile = null;
        this.previewUrl = null;
      } catch (err: any) {
        this.erro = `Erro ao adicionar usuário: ${err.message || 'Erro desconhecido'}`;
        console.error('Erro ao adicionar usuário:', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: this.erro });
      }
    }
  }

  async toggleEstadoUsuario(index: number) {
    const usuario = this.usuarios[index];
    const novoEstado = !usuario.isBloqueado;
    
    const changeStatusDTO: ChangeStatusDTO = {
      id: usuario.id,
      isBloqueado: novoEstado
    };

    try {
      const updatedUser = await firstValueFrom(this.usuarioService.changeStatus(changeStatusDTO));
      this.usuarios[index] = updatedUser;
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Sucesso', 
        detail: `Usuário ${novoEstado ? 'bloqueado' : 'desbloqueado'} com sucesso!` 
      });
      this.loadUsuarios();
    } catch (err: any) {
      this.erro = `Erro ao atualizar estado do usuário: ${err.message || 'Erro desconhecido'}`;
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: this.erro });
    }
  }

  onDialogShow() {
    if (this.displayDialog && this.nomeInput && !document.activeElement) {
      this.nomeInput.nativeElement.focus();
    }
  }

  onDialogHide() {
    this.formSubmitted = false;
    this.selectedFile = null;
    this.previewUrl = null;
    this.passwordStrength = '';
  }
}