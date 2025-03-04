import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoginService } from "../session/services/login.service";
import { Router } from "@angular/router";
import { catchError, throwError, switchMap } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  // Add token to authorized requests
  if (loginService.isLoggedIn()) {
    const token = loginService.getToken();
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401 && !req.url.includes('login')) {
        // Redirect to login on authentication errors
        loginService.logout();
        router.navigate(['/login']);
      }
      
      // Pass the error along
      return throwError(() => error);
    })
  );
}
