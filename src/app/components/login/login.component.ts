import { Component } from '@angular/core';
import { UsuarioLoginDTO, LoginResponse } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mostrarPassword: boolean = false;
  loginDTO: UsuarioLoginDTO = { email: '', senha: '' };

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router
  ) {}

  clicarMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  
}