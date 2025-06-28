import { NgModule, isDevMode } from '@angular/core';
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
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { CarouselModule } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { PasswordModule } from 'primeng/password'; // Adicionar importação do PasswordModule


import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SideMenuComponent } from './admin-pages/side-menu/side-menu.component';
import { DashboardComponent } from './admin-pages/admin-links/dashboard/dashboard.component';
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
import { PedidoMarcacaoComponent } from './admin-pages/admin-links/pedido-marcacao/pedido-marcacao.component';
import { PerfilUserComponent } from './components/paginas-menu/perfil-user/perfil-user.component';
import { MudarSenhaComponent } from './components/mudar-senha/mudar-senha.component';
import { ServiceWorkerModule } from '@angular/service-worker';

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
    PerfilUserComponent,
    MudarSenhaComponent,
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
    ProfissionaisComponent,
    PedidoMarcacaoComponent,
    SubsistemaSaudeComponent,
    TipoDeConsultaExameComponent,
    UsuariosComponent,
    HttpClientModule,
    ToastModule,
    CardModule,
    InputTextModule, // Para p-inputText
    MenubarModule,
    CarouselModule,
    AccordionModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    TabViewModule,
    PasswordModule, // Adicionar PasswordModule aos imports
    ReactiveFormsModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})
],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, MessageService,
    providePrimeNG({
      theme:{
        preset: Aura,
        options:{
          darkModeSelector: false // aplicar o tema claro do Aura
        }
      }
    }) 
  ],
  bootstrap: [AppComponent]
  })
export class AppModule { }
