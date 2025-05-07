import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importar o módulo de animações
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastModule } from 'primeng/toast'; // Importar o ToastModule
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import Aura from '@primeng/themes/aura'
import { CarouselModule } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SideMenuComponent } from './admin-pages/side-menu/side-menu.component';
import { DashboardComponent } from './admin-pages/admin-links/dashboard/dashboard.component';
import { ProdutosComponent } from './admin-pages/admin-links/produtos/produtos.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
// PrimeNG Modules
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AdminMainPageComponent } from './admin-pages/admin-main-page/admin-main-page.component';
import {ProfissionaisComponent} from './admin-pages/admin-links/profissionais2/profissionais.component';
import { UsuariosComponent } from './admin-pages/admin-links/usuarios/usuarios.component';
import { SubsistemaSaudeComponent } from './admin-pages/admin-links/subsistema-saude/subsistema-saude.component';
import { TipoDeConsultaExameComponent } from './admin-pages/admin-links/tipo-de-consulta-exame/tipo-de-consulta-exame.component';
import { providePrimeNG } from 'primeng/config';
import { ConsultasExamesComponent } from './components/paginas-menu/consultas-exames/consultas-exames.component';
import { NewsletterFaqSectionComponent } from './components/pagina-inicial/newsletter-faq-section/newsletter-faq-section.component';
import { SobreNosComponent } from './components/paginas-menu/sobre-nos/sobre-nos.component';
import { ContacteNosComponent } from './components/paginas-menu/contacte-nos/contacte-nos.component';
import { EquipaComponent } from './components/paginas-menu/equipa/equipa.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    PaginaInicialComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    ConsultasExamesComponent,
    NewsletterFaqSectionComponent,
    SobreNosComponent,
    ContacteNosComponent,
    EquipaComponent,


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
    ProfissionaisComponent,
    SubsistemaSaudeComponent,
    TipoDeConsultaExameComponent,
    UsuariosComponent,
    HttpClientModule,
    ToastModule,
    CardModule,
    InputTextModule, // Para p-inputText
    MenubarModule,
    CarouselModule,
    AccordionModule
],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, MessageService,
    providePrimeNG({
      theme:{
        preset: Aura
        
      }
    }) 
  ],
  bootstrap: [AppComponent]
  })
export class AppModule { }
