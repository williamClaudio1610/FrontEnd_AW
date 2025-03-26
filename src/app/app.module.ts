import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importar o módulo de animações
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SideMenuComponent } from './admin-pages/side-menu/side-menu.component';
import { DashboardComponent } from './admin-pages/admin-links/dashboard/dashboard.component';
import { ProdutosComponent } from './admin-pages/admin-links/produtos/produtos.component';

// PrimeNG Modules
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AdminMainPageComponent } from './admin-pages/admin-main-page/admin-main-page.component';
import { FuncionariosComponent } from './admin-pages/admin-links/funcionarios/funcionarios.component';
import { UsuariosComponent } from './admin-pages/admin-links/usuarios/usuarios.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PaginaInicialComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Adicione o FormsModule ao array de imports
    SidebarModule, // Para o side menu
    MenuModule, // Para o menu estilizado
    ButtonModule, // Para botões estilizados
    BrowserAnimationsModule,
    SideMenuComponent,
    AdminMainPageComponent,
    DashboardComponent,
    ProdutosComponent,
    FuncionariosComponent,
    UsuariosComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
