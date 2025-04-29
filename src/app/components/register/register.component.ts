import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'; // Para redirecionamento
import { UsuarioService } from '../../services/usuario.service'; // Ajuste o caminho conforme sua estrutura
import { RegisterUser, CreateUserDTO } from '../../models/usuario';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user: RegisterUser = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    province: '',
    perfil: '',
  };

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  provinces: string[] = [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte',
    'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte',
    'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire',
  ];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.user.password !== this.user.confirmPassword) {
      this.mensagemErro = 'As senhas não coincidem.';
      this.mensagemSucesso = null;
      return;
    }

    const userDto: CreateUserDTO = {
      nome: this.user.username,
      email: this.user.email,
      senhaHash: this.user.password,
      telemovel: this.user.phoneNumber,
      morada: this.user.province,
      perfil: this.user.perfil,
      dataNascimento: undefined, // Opcional
      genero: undefined, // Opcional
      fotografia: undefined, // Opcional
    };

    this.usuarioService.cadastrarUsuario(userDto).subscribe({
      next: (response) => {
        this.mensagemSucesso = `Usuário ${response.nome} cadastrado com sucesso!`;
        this.mensagemErro = null;
        this.resetForm();
        // Redirecionar para a tela de login após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.mensagemErro = err.message;
        this.mensagemSucesso = null;
      },
    });
  }

  private resetForm(): void {
    this.user = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      province: '',
      perfil: '',
    };
  }
}