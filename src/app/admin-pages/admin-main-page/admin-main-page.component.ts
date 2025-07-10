import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-admin-main-page',
  standalone: true,
  imports: [
    RouterOutlet,
    SideMenuComponent
  ],
  templateUrl: './admin-main-page.component.html',
  styleUrls: ['./admin-main-page.component.css']
})
export class AdminMainPageComponent implements OnInit {
  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit() {
    const usuario = this.usuarioService.getCurrentUser();
    if (usuario && usuario.perfil === 'Administrativo') {
      this.router.navigate(['/admin/pedidosMarcacao']);
    }
  }
}