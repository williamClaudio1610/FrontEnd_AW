import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class AdminRoleGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

 canActivate(route: ActivatedRouteSnapshot): boolean {
  const usuario = this.usuarioService.getCurrentUser();
  const allowedPathsForAdmin = ['marcacao', 'usuarios'];

  const currentPath = route.routeConfig?.path || '';
  const isAdmin = usuario?.perfil === 'Administrador';

  if (isAdmin && allowedPathsForAdmin.includes(currentPath)) {
    return true;
  }

  this.router.navigate(['/paginaInicial']);
  return false;
}

}
