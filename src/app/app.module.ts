import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {LoginService} from "./session/services/login.service";
import {CookieService} from 'ngx-cookie-service';
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
    LoginService,
    CookieService,

  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
