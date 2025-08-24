import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core'
import {provideRouter} from '@angular/router'

import {routes} from './app.routes'
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "@core/interceptors/auth.interceptor";
import {TimezoneService} from "@core/services/timezone/timezone.service";

// Factory function to initialize the TimezoneService
function initializeTimezoneFactory(timezoneService: TimezoneService) {
  return () => {
    console.log('Initializing TimezoneService at app startup');
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    // Ensure TimezoneService is initialized when the app starts
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTimezoneFactory,
      deps: [TimezoneService],
      multi: true
    }
  ]
};
