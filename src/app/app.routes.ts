import {Routes} from '@angular/router';
import {HomeComponent} from './core/components/home/home.component';
import {LoginComponent} from './session/components/login/login.component';
import {RegisterComponent} from './session/components/register/register.component';
import {AppComponent} from "./app.component";
import {MainLayoutComponent} from "./main-layout/main-layout.component";
import {DashboardComponent} from "./core/components/dashboard/dashboard.component";
import {ForgotPasswordComponent} from "./session/components/forgot-password/forgot-password.component";
import {Pages}

export const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', component: HomeComponent},
      {path: 'home', component: HomeComponent},
      {path: 'dashboard', component: DashboardComponent},

    ]
  },
  { path: '**', component: PageNotFoundComponent }
];
