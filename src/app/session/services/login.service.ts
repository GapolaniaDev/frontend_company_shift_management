import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {
  }

  login(data: any): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.error('Error logging in', error);
        return of(false);
      })
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.tokenKey) !== null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

}
