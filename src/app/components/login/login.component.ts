import { Component } from '@angular/core';
import { LoginDTO, Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent {
  mostrarPassword: boolean = false;
  loginDTO: LoginDTO = { email: '', senha: '' };
  mensagemErro: string | undefined;

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router
  ) {}

  clicarMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit(): void {
    this.mensagemErro = undefined;

    if (!this.loginDTO.email || !this.loginDTO.senha) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos.',
      });
      return;
    }

    this.usuarioService.login(this.loginDTO).subscribe({
      next: (usuario: Usuario) => {
        console.log('Usuário recebido no LoginComponent:', usuario); // Depuração
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Bem-vindo, ${usuario.nome || 'Usuário'}!`, // Fallback
          life: 2000,
        });

        setTimeout(() => {
          console.log('Redirecionando com perfil:', usuario.perfil); // Depuração
          if (usuario.perfil === 'UtenteRegistado') {
            this.router.navigate(['/paginaInicial']);
          } else if (usuario.perfil === 'Administrativo' || usuario.perfil === 'Administrador') {
            this.router.navigate(['admin/dashboard']);
          }else if (usuario.perfil === 'UtenteAnonimo') {
            this.router.navigate(['/mudarSenha']);
          } else {
            this.router.navigate(['/home']);
          }
        }, 2000);
      },
      error: (err) => {
        this.mensagemErro = err.message;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: this.mensagemErro,
        });
      },
    });
  }
}