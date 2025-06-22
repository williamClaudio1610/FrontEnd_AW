import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';



@Component({
  selector: 'app-mudar-senha',
  standalone: false,
  templateUrl: './mudar-senha.component.html',
  styleUrls: ['./mudar-senha.component.css'],
  providers: [MessageService]
})
export class MudarSenhaComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  passwordStrength: string = '';
  passwordsMismatch: boolean = false;
  currentPasswordInvalid: boolean = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

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
    
    // Chamar o serviço para alterar a senha
    this.usuarioService.alterarSenha(this.newPassword).subscribe({
      next: () => {
        this.successMessage = 'Senha alterada com sucesso! Redirecionando! Pode fazer o Login normalmente.';
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Ocorreu um erro ao alterar a senha.';
      }
    });
  }
}