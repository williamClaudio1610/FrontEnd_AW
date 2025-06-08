import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminMainPageComponent } from './admin-pages/admin-main-page/admin-main-page.component'; // Importar o FormsModule
import { ConsultasExamesComponent } from './components/paginas-menu/consultas-exames/consultas-exames.component';
import { ContacteNosComponent } from './components/paginas-menu/contacte-nos/contacte-nos.component';
import { EquipaComponent } from './components/paginas-menu/equipa/equipa.component';
import { SobreNosComponent } from './components/paginas-menu/sobre-nos/sobre-nos.component';
//componentes do admin
import { DashboardComponent } from './admin-pages/admin-links/dashboard/dashboard.component';
import { ProfissionaisComponent } from './admin-pages/admin-links/profissionais2/profissionais.component';
import { UsuariosComponent } from './admin-pages/admin-links/usuarios/usuarios.component';
import { SubsistemaSaudeComponent } from './admin-pages/admin-links/subsistema-saude/subsistema-saude.component';
import { TipoDeConsultaExameComponent } from './admin-pages/admin-links/tipo-de-consulta-exame/tipo-de-consulta-exame.component';
import { MarcacaoComponent } from './admin-pages/admin-links/marcacao/marcacao.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {path: 'login',component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'paginaInicial',component: PaginaInicialComponent},
  {path: 'header',component: HeaderComponent},
  {path: 'footer',component: FooterComponent},
  {path: 'consultasExames',component: ConsultasExamesComponent},
  {path: 'contacteNos',component: ContacteNosComponent},
  {path: 'equipa',component: EquipaComponent},
  {path: 'sobreNos',component: SobreNosComponent},
  {
    path: 'admin',
    component: AdminMainPageComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'marcacao', component: MarcacaoComponent },
      { path: 'profissionais', component: ProfissionaisComponent }, // Adicionado
      {path: 'usuarios', component: UsuariosComponent},
      {path: 'subsistemaSaude', component: SubsistemaSaudeComponent},
      {path: 'tipoDeExameConsulta', component: TipoDeConsultaExameComponent},
      {path: 'pedidosMarcacao', component: MarcacaoComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {path: '',redirectTo: '/paginaInicial',pathMatch: 'full'},
  { path: '**', redirectTo: '/paginaInicial' } // Rota curinga para redirecionar qualquer rota inválida
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

