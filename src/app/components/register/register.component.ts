import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CreateUserDTO } from '../../models/usuario';
import { MessageService } from 'primeng/api';
import { HttpEvent, HttpEventType } from '@angular/common/http';

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
    fotografia: undefined,
    nome: '',
    email: '',
    senhaHash: '',
    perfil: 'UtenteRegistado',
    telemovel: '',
    morada: '',
    dataNascimento: undefined,
    genero: '',
    numeroUtente: '',
  };
  provinces: string[] = [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte',
    'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte',
    'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire',
  ];

  selectedFile: File | null = null; // Para armazenar o arquivo bruto
  previewUrl: string | null = null; // Para armazenar a URL de preview
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Criar URL de preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    // Limpar o input file
    const fileInput = document.getElementById('fotografia') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  openFileSelector(): void {
    const fileInput = document.getElementById('fotografia') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  formatarDataParaEnvio(dateString: string | Date): string {
    let date: Date;

    if (typeof dateString === 'string') {
      // Converte string para objeto Date
      date = new Date(dateString);
    } else {
      date = dateString;
    }

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
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
      numeroUtente: this.user.numeroUtente,
      confirmarsenhaHash: this.confirmarsenhaHash,
      selectedFile: this.selectedFile,
    });

    if (this.user.senhaHash !== this.confirmarsenhaHash) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'As senhas não coincidem.',
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
    
    // Concatenar província em Morada
    this.user.morada = `${this.user.morada}, ${this.provincia}`;

    // Corrigir o formato da data
    const dataNascimentoFormatada = this.formatarDataParaEnvio(new Date(this.user.dataNascimento!));

    const formData = new FormData();

    // Todos os campos em PascalCase para corresponder ao DTO do backend
    formData.append('Nome', this.user.nome);
    formData.append('Email', this.user.email);
    formData.append('SenhaHash', this.user.senhaHash); // PascalCase
    formData.append('Perfil', this.user.perfil);
    formData.append('Telemovel', this.user.telemovel);
    formData.append('Morada', this.user.morada);
    formData.append('DataNascimento', dataNascimentoFormatada); // Data formatada
    formData.append('Genero', this.user.genero); // PascalCase
    formData.append('NumeroUtente', this.user.numeroUtente);
    // Sempre envie o campo Fotografia, mesmo que vazio
    formData.append('Fotografia', this.selectedFile ? this.selectedFile : new Blob());

    // DEBUG: Mostrar conteúdo do FormData
    for (let [key, value] of (formData as any).entries()) {
      console.log(key, value);
    }

    this.usuarioService.cadastrarUsuario(formData).subscribe({
      next: (response: any) => {
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
        // Melhor tratamento de erro
        let errorMessage = 'Erro ao cadastrar usuário';

        if (err.error && typeof err.error === 'object') {
          // Tentar extrair mensagens de validação do backend
          const errors = [];
          for (const key in err.error) {
            if (err.error[key]) {
              errors.push(...err.error[key]);
            }
          }
          errorMessage = errors.join('\n');
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: errorMessage,
        });
      },
    });
  }

}