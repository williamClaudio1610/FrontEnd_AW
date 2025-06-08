import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  usuario: Usuario | null = null; // Inicializa como nulo
  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/admin/dashboard'] },
    { label: 'Pedidos/Marcações', icon: 'pi pi-box', routerLink: ['/admin/pedidosMarcacao'] },
    { label: 'Profissionais', icon: 'pi pi-briefcase', routerLink: ['/admin/profissionais'] } ,
    { label: 'Tipode de Exame/Consulta', icon: 'pi pi-briefcase', routerLink: ['/admin/tipoDeExameConsulta'] } ,
    { label: 'Subsistema de Saúde', icon: 'pi pi-briefcase', routerLink: ['/admin/subsistemaSaude'] } ,
    { label: 'Usuários', icon: 'pi pi-briefcase', routerLink: ['/admin/usuarios'] } 
  ];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    console.log('Menu Items:', this.menuItems); // Para depuração
    this.usuario = this.usuarioService.getCurrentUser();
  }

  logout() {
    this.usuarioService.logout(); // Limpa o token e o usuário
    this.usuario = null;
  }
}