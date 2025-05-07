import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminMainPageComponent } from './admin-pages/admin-main-page/admin-main-page.component'; // Importar o FormsModule
import { ConsultasExamesComponent } from './components/consultas-exames/consultas-exames.component';
//componentes do admin
import { DashboardComponent } from './admin-pages/admin-links/dashboard/dashboard.component';
import { ProdutosComponent } from './admin-pages/admin-links/produtos/produtos.component';
import { ProfissionaisComponent } from './admin-pages/admin-links/profissionais2/profissionais.component';
import { UsuariosComponent } from './admin-pages/admin-links/usuarios/usuarios.component';
import { SubsistemaSaudeComponent } from './admin-pages/admin-links/subsistema-saude/subsistema-saude.component';
import { TipoDeConsultaExameComponent } from './admin-pages/admin-links/tipo-de-consulta-exame/tipo-de-consulta-exame.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

const routes: Routes = [
  {path: 'login',component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'paginaInicial',component: PaginaInicialComponent},
  {path: 'header',component: HeaderComponent},
  {path: 'footer',component: FooterComponent},
  {path: 'consultasExames',component: ConsultasExamesComponent},
  {
    path: 'admin',
    component: AdminMainPageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'produtos', component: ProdutosComponent },
      { path: 'profissionais', component: ProfissionaisComponent }, // Adicionado
      {path: 'usuarios', component: UsuariosComponent},
      {path: 'subsistemaSaude', component: SubsistemaSaudeComponent},
      {path: 'tipoDeExameConsulta', component: TipoDeConsultaExameComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {path: '',redirectTo: '/login',pathMatch: 'full'},
  { path: '**', redirectTo: '/login' } // Rota curinga para redirecionar qualquer rota inválida
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
