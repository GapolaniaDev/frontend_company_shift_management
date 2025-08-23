import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoginService} from "@features/session";
import {CookieService} from 'ngx-cookie-service';
import {routes} from './app.routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GoogleMapsModule} from '@angular/google-maps';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule

  ],
  providers: [
    LoginService,
    CookieService,
  ],
  bootstrap: [],
})
export class AppModule {
}
