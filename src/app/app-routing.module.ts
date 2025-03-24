import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminMainPageComponent } from './admin-pages/admin-main-page/admin-main-page.component'; // Importe o FormsModule
import { DashboardComponent } from './admin-pages/admin-links/dashboard/dashboard.component';


const routes: Routes = [
  {path: 'login',component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'paginaInicial',component: PaginaInicialComponent},
  {path: 'header',component: HeaderComponent},
  {path: 'footer',component: FooterComponent},
  {
    path: 'adminMainPage',
    component: AdminMainPageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent }, 
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {path: '',redirectTo: '/paginaInicial',pathMatch: 'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
