import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdministrativoGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(): boolean {
    const user = this.usuarioService.getCurrentUser();
    if (user && user.perfil === 'Administrativo') {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
} 