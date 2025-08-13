import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User
} from "@app/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private currentUser: User | null = null;

  constructor(private apiService: ApiService) { }

  /**
   * Register a new user
   * @param registerData Registration data
   * @returns Observable of the registration response
   */
  register(registerData: RegisterRequest): Observable<any> {
    return this.apiService.post<any>('register', registerData);
  }

  /**
   * Login a user
   * @param loginData Login credentials
   * @returns Observable of the authentication response
   */
  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('login', loginData).pipe(
      tap(response => {
        this.setToken(response.token);
        this.currentUser = response.user;
      })
    );
  }

  /**
   * Logout the current user
   * @returns Observable of the logout response
   */
  logout(): Observable<any> {
    return this.apiService.post<any>('logout', {}).pipe(
      tap(() => {
        this.clearToken();
        this.currentUser = null;
      })
    );
  }

  /**
   * Get the current authenticated user
   * @returns Observable of the user data
   */
  getCurrentUser(): Observable<User> {
    if (this.currentUser) {
      return new Observable<User>(observer => {
        observer.next(this.currentUser!);
        observer.complete();
      });
    }

    return this.apiService.get<{ data: User }>('user').pipe(
      map(response => {
        this.currentUser = response.data;
        return response.data;
      }),
      catchError(error => {
        this.clearToken();
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh the authentication token
   * @param extendedToken Whether to issue an extended token
   * @returns Observable of the refresh response
   */
  refreshToken(extendedToken: boolean = false): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('refresh-token', { extended_token: extendedToken }).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }

  /**
   * Check if the user is authenticated
   * @returns Whether the user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get the authentication token
   * @returns The authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Set the authentication token
   * @param token The authentication token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Clear the authentication token
   */
  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
