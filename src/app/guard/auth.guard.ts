import {CanActivate, Router} from '@angular/router';
import {Injectable} from "@angular/core";
import {LoginService} from "../session/services/login.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    if (this.loginService.isLoggedIn()) {
      // Permitir acceso a la ruta
      return true;
    } else {
      // Redirigir al usuario al login si no está autenticado
      this.router.navigate(['/login']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    if (this.loginService.isLoggedIn()) {
      // Si el usuario ya está autenticado, redirigir a la página principal
      this.router.navigate(['/home']);
      return false;
    } else {
      // Permitir acceso a la página de login si no está autenticado
      return true;
    }
  }
}
