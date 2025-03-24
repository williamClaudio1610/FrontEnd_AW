import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MenuModule
  ],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/admin/dashboard']
      },
      {
        label: 'Produtos',
        icon: 'pi pi-box',
        routerLink: ['/admin/produtos']
      },
      {
        label: 'Clientes',
        icon: 'pi pi-users',
        routerLink: ['/admin/clientes']
      },
      {
        label: 'Funcionários',
        icon: 'pi pi-briefcase',
        routerLink: ['/admin/funcionarios']
      }
    ];
  }
}