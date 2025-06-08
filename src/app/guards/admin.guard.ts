import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(): boolean {
    const usuario = this.usuarioService.getCurrentUser();
    console.log('Verificando permissão para usuário:', usuario); // Depuração

    if (usuario && (usuario.perfil === 'Administrador' || usuario.perfil === 'Administrativo')) {
      return true; // Permite acesso
    } else {
      this.router.navigate(['/paginaInicial']); // Redireciona se não autorizado
      return false; // Bloqueia acesso
    }
  }
}
