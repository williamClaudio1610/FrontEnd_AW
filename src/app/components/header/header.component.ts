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
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; // Simule o estado de login (pode ser gerenciado por um serviço de autenticação)
  searchQuery: string = '';

  usuario: Usuario | null = null;
  showDropdown: boolean = false;
  hasImageError: boolean = false;
  
  constructor(private usuarioService: UsuarioService) {}
  onSearch() {
    console.log('Pesquisando:', this.searchQuery);
    // Adicione sua lógica de busca aqui
  }

  ngOnInit() {
    this.usuario = this.usuarioService.getCurrentUser();
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
}