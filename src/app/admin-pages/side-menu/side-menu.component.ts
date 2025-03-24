import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/admin/dashboard'] },
    { label: 'Produtos', icon: 'pi pi-box', routerLink: ['/admin/produtos'] },
    { label: 'Funcionários', icon: 'pi pi-briefcase', routerLink: ['/admin/funcionarios'] } ,
    { label: 'Clientes', icon: 'pi pi-briefcase', routerLink: ['/admin/clientes'] } 
  ];

  ngOnInit() {
    console.log('Menu Items:', this.menuItems); // Para depuração
  }
}