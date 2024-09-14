import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {LoginService} from "../session/services/login.service";
import {catchError} from "rxjs/operators";

export const authInterceptor: HttpInterceptorFn = (req, next) =>  {
  const loginService = inject(LoginService);
  if (loginService.isLoggedIn()) {
      const token = loginService.getToken();
      req = req.clone({
          setHeaders: {
              Authorization: `Bearer ${token}`
          }
      });
  }

  return next(req);
}
