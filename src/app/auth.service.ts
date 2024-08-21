import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private authTokenKey = 'authToken';
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.cookieService.set(this.authTokenKey, response.token);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  getToken(): string | null {
    return this.cookieService.get(this.authTokenKey);
  }

  logout(): void {
    this.cookieService.delete(this.authTokenKey);
    this.currentUserSubject.next(null);
  }

  getUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}
