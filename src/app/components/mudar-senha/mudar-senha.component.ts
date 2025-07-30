import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario, UpdateUserDTO, ChangePasswordDTO } from '../../models/usuario';
import { firstValueFrom } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mudar-senha',
  templateUrl: './mudar-senha.component.html',
  styleUrls: ['./mudar-senha.component.css'],
  providers: [MessageService],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    PasswordModule,
    ButtonModule
  ]
})
export class MudarSenhaComponent implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  passwordStrength: string = '';
  passwordsMismatch: boolean = false;
  currentPasswordInvalid: boolean = false;

  // Propriedades para foto de perfil
  user: Usuario | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isChangingPhoto: boolean = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const currentUser = this.usuarioService.getCurrentUser();
    this.user = currentUser ?? null;

    if (!this.user) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Usuário não autenticado. Faça login novamente.'
      });
      this.router.navigate(['/login']);
    }
  }

  checkPasswordsMatch() {
    this.passwordsMismatch = this.newPassword !== this.confirmPassword && this.confirmPassword !== '';
  }

  checkPasswordStrength() {
    if (!this.newPassword) {
      this.passwordStrength = '';
      return;
    }

    const length = this.newPassword.length;
    
    if (length < 8) {
      this.passwordStrength = 'weak';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  getPasswordStrengthText(): string {
    switch (this.passwordStrength) {
      case 'weak': return 'Mínimo 8 caracteres';
      case 'strong': return 'Senha válida';
      default: return '';
    }
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.passwordsMismatch = false;

    if (this.newPassword !== this.confirmPassword) {
      this.passwordsMismatch = true;
      this.errorMessage = 'As senhas não coincidem.';
      this.loading = false;
      return;
    }

    if (this.passwordStrength === 'weak') {
      this.errorMessage = 'Sua senha é muito fraca. Por favor, escolha uma senha mais forte.';
      this.loading = false;
      return;
    }

    if (!this.user) {
      this.errorMessage = 'Usuário não identificado.';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    const changePasswordDTO: ChangePasswordDTO = {
      id: this.user.id,
      senhaAtual: this.currentPassword,
      novaSenha: this.newPassword
    };

    try {
      const updatedUser = await firstValueFrom(this.usuarioService.changePassword(changePasswordDTO));
      this.successMessage = 'Senha alterada com sucesso! Redirecionando...';
      this.loading = false;
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      this.user = updatedUser || null;
      setTimeout(() => {
        this.router.navigate(['/perfil']);
      }, 2000);
    } catch (err: any) {
      this.loading = false;
      this.errorMessage = err.message || 'Erro ao alterar a senha.';
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: this.errorMessage
      });
    }
  }

  async updateProfilePhoto() {
    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, selecione uma imagem primeiro.'
      });
      return;
    }

    if (!this.user) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Usuário não identificado.'
      });
      this.router.navigate(['/login']);
      return;
    }

    this.isChangingPhoto = true;

    const updateDTO: UpdateUserDTO = {
      id: this.user.id,
      nome: this.user.nome,
      email: this.user.email,
      telemovel: this.user.telemovel || '',
      morada: this.user.morada || '',
      genero: this.user.genero || '',
      dataNascimento: this.user.dataNascimento || new Date().toISOString().split('T')[0],
      fotografia: this.selectedFile,
      perfil: this.user.perfil,
      numeroUtente: this.user.numeroUtente,
      isBloqueado: this.user.isBloqueado
    };

    try {
      const updatedUser = await firstValueFrom(this.usuarioService.updateUsuario(updateDTO));
      this.user = updatedUser;
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      this.isChangingPhoto = false;
      this.selectedFile = null;
      this.previewUrl = null;
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Foto de perfil atualizada com sucesso!'
      });
    } catch (err: any) {
      this.isChangingPhoto = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: err.message || 'Erro ao atualizar foto de perfil.'
      });
    }
  }

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
    if (this.user?.fotografia) {
      return 'https://localhost:7273' + (this.user.fotografia.startsWith('/') ? this.user.fotografia : `/Uploads/${this.user.fotografia}`);
    }
    return '/assets/default-user.png';
  }
}