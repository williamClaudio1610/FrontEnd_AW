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
  confirmarsenhaHash: string = '';
  provincia: string = '';
  user: CreateUserDTO = {
    fotografia: '',
    nome: '',
    email: '',
    senhaHash: '',
    perfil: 'Utente Registado',
    telemovel: '',
    morada: '',
    dataNascimento: undefined,
    genero: '',
  };
  provinces: string[] = [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte',
    'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte',
    'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire',
  ];

  errorMessage: string = '';
  successMessage: string = '';
  

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
        this.user.fotografia = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.user.fotografia = '';
    }
  }

  onSubmit(): void {
    console.log('Valores do formulário:', {
      nome: this.user.nome,
      email: this.user.email,
      senhaHash: this.user.senhaHash,
      telemovel: this.user.telemovel,
      morada: this.user.morada,
      dataNascimento: this.user.dataNascimento,
      genero: this.user.genero,
      provincia: this.provincia,
      confirmarsenhaHash: this.confirmarsenhaHash,
      fotografia: this.user.fotografia,
    });

    if (this.user.senhaHash !== this.confirmarsenhaHash) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'As senhaHashs não coincidem.',
      });
      return;
    }

    if (
      !this.user.nome ||
      !this.user.email ||
      !this.user.senhaHash ||
      !this.user.telemovel ||
      !this.user.morada ||
      !this.user.dataNascimento ||
      !this.user.genero
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos obrigatórios.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'E-mail inválido.',
      });
      return;
    }

    const telemovelRegex = /^\+244\d{9}$/;
    if (!telemovelRegex.test(this.user.telemovel)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'O número de telemóvel deve seguir o formato +244 seguido de 9 dígitos.',
      });
      return;
    }

    this.user.morada = `${this.user.morada}, ${this.provincia}`;

    const userDTO: CreateUserDTO = {
      fotografia: this.user.fotografia || '',
      nome: this.user.nome,
      email: this.user.email,
      senhaHash: this.user.senhaHash,
      perfil: 'Utente Registado',
      telemovel: this.user.telemovel,
      morada: this.user.morada,
      dataNascimento: new Date(this.user.dataNascimento),
      genero: this.user.genero,
    };

    this.usuarioService.cadastrarUsuario(this.user).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Usuário ${response.nome} cadastrado com sucesso!`,
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || JSON.stringify(err.error),
        });
      },
    });
  }
}