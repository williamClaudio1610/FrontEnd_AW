import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mostrarPassword: boolean = false;

  clicarMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

}
