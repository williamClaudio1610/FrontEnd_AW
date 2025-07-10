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
  hasImageError: boolean = false;
  imageLoading: boolean = false;
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
    this.hasImageError = false;
    this.imageLoading = false;

    // Ajusta os itens do menu conforme o perfil
    if (this.usuario && this.usuario.perfil === 'Administrativo') {
      this.menuItems = [
        { label: 'Pedidos/Marcações', icon: 'pi pi-box', routerLink: ['/admin/pedidosMarcacao'] }
      ];
    }
  }

  logout() {
    this.usuarioService.logout(); // Limpa o token e o usuário
    this.usuario = null;
  }

  
  onImgLoad() {
    this.hasImageError = false; // Reset do erro quando a imagem carrega com sucesso
    this.imageLoading = false;
  }

  onImgLoadStart() {
    this.imageLoading = true;
    this.hasImageError = false;
  }

  onImgError() {
    this.hasImageError = true; // Marca o erro para forçar o fallback
  }
  getUserPhotoUrl(): string {
    // Usa o método do service para obter a URL da foto
    return this.usuarioService.getUserPhotoUrl() || 'assets/default-user.png';
  }
}