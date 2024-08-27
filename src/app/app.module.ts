import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {AuthService} from './auth.service';
import {LoginService} from "./session/services/login.service";
import {CookieService} from 'ngx-cookie-service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './auth.interceptor';
import {routes} from './app.routes';
import {CoreModule} from './core/core.module';
import {SessionModule} from './session/session.module';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    CoreModule,
    SessionModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    LoginService,
    CookieService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},

  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
