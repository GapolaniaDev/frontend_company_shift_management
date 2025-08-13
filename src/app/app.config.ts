import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "@core/interceptors/auth.interceptor";
import { TimezoneService } from './services/timezone/timezone.service'

// Factory function to initialize the TimezoneService
function initializeTimezoneFactory(timezoneService: TimezoneService) {
  return () => {
    // The service constructor already initializes the timezone
    // but we return a resolved promise to ensure the app waits for it
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
