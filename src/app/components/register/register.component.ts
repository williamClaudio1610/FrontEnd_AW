
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CreateUserDTO } from '../../models/usuario';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  confirmarSenha: string = '';
  user: CreateUserDTO = {
    nome: '',
    email: '',
    senhaHash: '',
    perfil: '',
    telemovel: '',
    morada: '',
    dataNascimento: undefined,
    genero: '',
    fotografia: undefined,
    provincia: '', // Campo adicional para província
  };
  provinces: string[] = [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte',
    'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte',
    'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire',
  ];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.user.fotografia = reader.result as string; // Armazena a imagem como base64
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    // Validar se as senhas coincidem
    if (this.user.senhaHash !== this.confirmarSenha) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'As senhas não coincidem.',
      });
      return;
    }

    // Combinar morada e província
    this.user.morada = `${this.user.morada}, ${this.user.provincia}`;

    // Chamar o serviço para registrar o usuário
    this.usuarioService.cadastrarUsuario(this.user).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Usuário ${response.nome} cadastrado com sucesso!`,
        });
        // Redirecionar para a tela de login após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.message,
        });
      },
    });
  }
}