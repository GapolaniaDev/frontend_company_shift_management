import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { routes } from './app.routes';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes)],
  providers: [
    AuthService,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
