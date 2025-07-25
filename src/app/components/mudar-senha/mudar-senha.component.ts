import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario, UpdateUserDTO } from '../../models/usuario';



@Component({
  selector: 'app-mudar-senha',
  standalone: false,
  templateUrl: './mudar-senha.component.html',
  styleUrls: ['./mudar-senha.component.css'],
  providers: [MessageService]
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
  selectedFile: File | undefined = undefined;
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
    this.user = this.usuarioService.getCurrentUser();
  }

  checkPasswordsMatch() {
    this.passwordsMismatch = this.newPassword !== this.confirmPassword && this.confirmPassword !== '';
  }

  checkPasswordStrength() {
    if (!this.newPassword) {
      this.passwordStrength = '';
      return;
    }
    
    const hasLetters = /[a-zA-Z]/.test(this.newPassword);
    const hasNumbers = /[0-9]/.test(this.newPassword);
    const hasSpecial = /[^a-zA-Z0-9]/.test(this.newPassword);
    const length = this.newPassword.length;
    
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

  onSubmit() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.passwordsMismatch = false;
    
    // Verificar se as senhas coincidem
    if (this.newPassword !== this.confirmPassword) {
      this.passwordsMismatch = true;
      this.errorMessage = 'As senhas não coincidem.';
      this.loading = false;
      return;
    }
    
    // Verificar força da senha
    if (this.passwordStrength === 'weak') {
      this.errorMessage = 'Sua senha é muito fraca. Por favor, escolha uma senha mais forte.';
      this.loading = false;
      return;
    }

    if (!this.user) {
      this.errorMessage = 'Usuário não identificado.';
      this.loading = false;
      return;
    }

    // Enviar todos os dados obrigatórios, senha e foto
    const updateDTO: UpdateUserDTO = {
      id: this.user.id,
      nome: this.user.nome,
      email: this.user.email,
      morada: this.user.morada || '',
      telemovel: this.user.telemovel || '',
      genero: this.user.genero || '',
      dataNascimento: this.user.dataNascimento,
      numeroUtente: this.user.numeroUtente,
      perfil: 'UtenteRegistado', // Envia o valor atual do perfil
      //senhaHash: this.newPassword, // nova senha
      fotografia: this.selectedFile, // foto (File)
      estado: this.user.estado
    };

    console.log('Update DTO:', updateDTO);

    this.usuarioService.updateUsuario(updateDTO).subscribe({
      next: () => {
        this.successMessage = 'Senha e perfil atualizados com sucesso! Redirecionando! Pode fazer o Login normalmente.';
        this.loading = false;
        // Redirecionar após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Ocorreu um erro ao atualizar o perfil.';
      }
    });
  }

  // Métodos para upload de foto de perfil
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Por favor, selecione apenas arquivos de imagem'
        });
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'A imagem deve ter no máximo 5MB'
        });
        return;
      }

      this.selectedFile = file;
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = undefined;
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
      return 'https://localhost:7273' + this.user.fotografia;
    }
    return ''; // Retorna string vazia para mostrar o ícone padrão
  }

  updateProfilePhoto(): void {
    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, selecione uma imagem primeiro'
      });
      return;
    }

    if (!this.user) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Usuário não identificado'
      });
      return;
    }

    this.isChangingPhoto = true;

    // Obter a senha atual do serviço
    const currentPassword = this.usuarioService.getCurrentPassword();
    
    if (!currentPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Senha atual não encontrada. Faça login novamente.'
      });
      this.isChangingPhoto = false;
      return;
    }

    // Preparar dados para atualização
    const updateData: UpdateUserDTO = {
      id: this.user.id,
      nome: this.user.nome,
      email: this.user.email,
      telemovel: this.user.telemovel || '',
      morada: this.user.morada || '',
      genero: this.user.genero || '',
      dataNascimento: this.user.dataNascimento,
      fotografia: this.selectedFile,
      perfil: this.user.perfil,
      numeroUtente: this.user.numeroUtente,
      estado: this.user.estado,
     // senhaHash: currentPassword
    };

    this.usuarioService.updateUsuario(updateData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isChangingPhoto = false;
        this.selectedFile = undefined;
        this.previewUrl = null;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Foto de perfil atualizada com sucesso!'
        });
      },
      error: (error) => {
        this.isChangingPhoto = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar foto de perfil: ' + (error.message || 'Erro desconhecido')
        });
      }
    });
  }
}