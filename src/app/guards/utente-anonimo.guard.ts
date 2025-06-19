import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class utenteAnonimoGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(): boolean {
    const usuario = this.usuarioService.getCurrentUser();
    console.log('Verificando permissão para NaoRegistado:', usuario); // Depuração

    if (!usuario) {
      return true; // Permite acesso se não houver usuário logado
    } else {
      this.router.navigate(['/paginaInicial']); // Redireciona se já logado
      return false; // Bloqueia acesso
    }
  }
}
