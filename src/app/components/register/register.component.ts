import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    province: ''
  };

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Lista de províncias de Angola
  provinces: string[] = [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte',
    'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte',
    'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
  ];

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.user.password !== this.user.confirmPassword) {
      console.log('As senhas não coincidem');
      return;
    }
    console.log('Usuário registrado:', this.user);
    // Aqui você pode adicionar a lógica para enviar os dados ao backend
  }

}
