import { Component } from '@angular/core';
import { LoginDTO, Usuario, UpdateUserDTO } from '../../models/usuario';
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
  
  numTentativas: number = 0;
  userbLocked: boolean = false;

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

    if (this.userbLocked) {
      this.messageService.add({
        severity: 'error',
        summary: 'Bloqueado',
        detail: 'A sua conta está bloqueada. Contacte a direção da clínica XPTO.'
      });
      return;
    }

    if (!this.loginDTO.email || !this.loginDTO.senha) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos.',
        life: 400
      });
      return;
    }

    this.usuarioService.login(this.loginDTO).subscribe({
      next: (usuario: Usuario) => {

        if(usuario.estado === 'Bloqueado'){
          console.log('Usuário recebido no LoginComponent:', usuario); // Depuração
          this.messageService.add({
          severity: 'success',
          summary: 'Bloqueado',
          detail: `Sua conta se encontra bloqueada, ${usuario.nome || 'Usuário'}!, Entre em contacto com a nossa direcção`, // Fallback
          life: 2000,
        });
        return;
        }
        //resetar as tentativas caso tenha conseguido logar antes do bloqueio
        this.numTentativas = 0;
        this.userbLocked = false;
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
          } else if (usuario.perfil === 'UtenteAnonimo') {
            this.router.navigate(['/mudarSenha']);
          } else {
            this.router.navigate(['/home']);
          }

        }, 2000);
      },
      error: (err) => {
        this.numTentativas++;
        this.mensagemErro = err.message;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: this.mensagemErro,
        });

        // se ele tentar pela terceira vez o login (ou mais)
        if (this.numTentativas >= 3) {
          this.messageService.add({
            severity: 'error',
            summary: 'Bloqueado',
            detail: 'A sua conta foi temporariamente bloqueada devido a múltiplas tentativas falhadas.',
            life: 4000,
          });

          //fazer update do perfil do user caso este exceder as tentativas de login
          this.usuarioService.getAllUsuarios().subscribe({
            next: (usuarios) => {
              const usuario = usuarios.find(u => u.email.toLowerCase() === this.loginDTO.email.toLowerCase());
              if(usuario) {
                const updateDTO: UpdateUserDTO = {
                  id: usuario.id,
                  nome: usuario.nome, // nunca vazio
                  dataNascimento: usuario.dataNascimento, // nunca vazio
                  genero: usuario.genero, // nunca vazio
                  telemovel: usuario.telemovel, // nunca vazio
                  email: usuario.email, // nunca vazio
                  morada: usuario.morada, // nunca vazio
                  estado: 'Bloqueado',
                  perfil: usuario.perfil,
                  numeroUtente: usuario.numeroUtente,
                  senhaHash: '', // se não for alterar senha
                };
                this.usuarioService.updateUsuario(updateDTO).subscribe({
                  next: () => {
                    this.userbLocked = true;
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Erro',
                      detail: 'A sua conta foi bloqueada',
                      life: 400
                    })
                  },
                  error: (err) => {
                    console.error('Erro ao bloquear usuário:', err);
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Erro',
                      detail: 'Falha ao bloquear o usuário. Contate o suporte.',
                    });
                  }
                });
              } else{
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erro',
                  detail: 'Usuário não encontrado para bloqueio.',
                });
              }
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao buscar usuários para bloqueio.',
              });
            }
          })
        }
      },
    });
  }
}