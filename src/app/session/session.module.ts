import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from "./components/register/register.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {ReactiveFormsModule} from '@angular/forms';
import {  } from '@angular/common';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ForgotPasswordComponent],
  imports: [CommonModule, ReactiveFormsModule, CommonModule],
  exports: [LoginComponent, RegisterComponent, ForgotPasswordComponent]
})
export class SessionModule {
}
