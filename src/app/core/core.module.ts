import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import { PagesNotFoundComponent } from './components/pages-not-found/pages-not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PublicHomeComponent } from './components/public-home/public-home.component';

// Services
import { DarkModeService } from './services/dark-mode/dark-mode.service';
import { GeolocationService } from './services/geolocation/geolocation.service';
import { LoaderService } from './services/loader/loader.service';
import { GeoUtilsService } from './services/geo-utils/geo-utils.service';

// Auth & Guards
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth/auth.service';

// Interceptors
import { authInterceptor } from './http/auth.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    MenuComponent,
    HomeComponent,
    PagesNotFoundComponent,
    DashboardComponent,
    PublicHomeComponent
  ],
  providers: [
    DarkModeService,
    GeolocationService,
    LoaderService,
    GeoUtilsService,
    AuthGuard,
    AuthService
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    MenuComponent
  ]
})
export class CoreModule {
  // Prevent reimporting the CoreModule
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}