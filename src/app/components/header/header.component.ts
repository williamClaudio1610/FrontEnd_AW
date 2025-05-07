import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; // Simule o estado de login (pode ser gerenciado por um serviço de autenticação)
  searchQuery: string = '';
  
  constructor() {}
  onSearch() {
    console.log('Pesquisando:', this.searchQuery);
    // Adicione sua lógica de busca aqui
  }

  ngOnInit(): void {}
}