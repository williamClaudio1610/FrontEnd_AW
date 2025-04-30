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

    // Validar se os campos estão preenchidos
    if (!this.loginDTO.email || !this.loginDTO.senha) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos.',
      });
      return;
    }

    // Chamar o método login do UsuarioService
    this.usuarioService.login(this.loginDTO).subscribe({
      next: (usuario: Usuario) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Bem-vindo, ${usuario.nome}!`,
        });

        // Redirecionar para a página inicial ou outra página após o login
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
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