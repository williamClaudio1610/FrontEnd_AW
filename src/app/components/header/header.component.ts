import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; // Simule o estado de login (pode ser gerenciado por um serviço de autenticação)
  searchQuery: string = '';

  usuario: Usuario | null = null;
  showDropdown: boolean = false;
  hasImageError: boolean = false;
  imageLoading: boolean = false;
  
  constructor(private usuarioService: UsuarioService) {}
  onSearch() {
    console.log('Pesquisando:', this.searchQuery);
    // Adicione sua lógica de busca aqui
  }

  ngOnInit() {
    this.usuario = this.usuarioService.getCurrentUser();
    // Reset do estado da imagem quando carrega um novo usuário
    this.hasImageError = false;
    this.imageLoading = false;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.usuarioService.logout();
    this.usuario = null;
    this.showDropdown = false;
    //location.reload();
  }
  onImgError() {
    this.hasImageError = true; // Marca o erro para forçar o fallback
  }

  onImgLoad() {
    this.hasImageError = false; // Reset do erro quando a imagem carrega com sucesso
    this.imageLoading = false;
  }

  onImgLoadStart() {
    this.imageLoading = true;
    this.hasImageError = false;
  }

  getUserPhotoUrl(): string {
    // Usa o método do service para obter a URL da foto
    return this.usuarioService.getUserPhotoUrl() || 'assets/default-user.png';
  }
}