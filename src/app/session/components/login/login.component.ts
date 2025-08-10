import {Component, OnInit} from '@angular/core';
import {RouterLink, Router} from "@angular/router";
import {ReactiveFormsModule, FormControl, FormGroup, Validators} from '@angular/forms';
import {JsonPipe, NgIf} from "@angular/common";
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  loginError: string = '';
  isLoading: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';

      this.loginService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          if (error.status === 401) {
            this.loginError = error.error.error || 'Unauthorized';
          } else if (error.status === 0) {
            this.loginError = 'Unable to connect to the server. Please check your internet connection.';
          } else if (error.status >= 500) {
            this.loginError = 'An internal server error occurred. Please try again later.';
          } else {
            this.loginError = 'An unexpected error occurred. Please try again.';
          }
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onGoogleLogin(): void {
    this.isLoading = true;
    this.loginError = '';

    this.loginService.googleLogin().subscribe({
      next: (response) => {
        if (response && response.token) {
          this.router.navigate(['/home']);
        } else {
          this.loginError = 'Google login failed. Please try again.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Google login error:', error);
        if (error.status === 0) {
          this.loginError = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error.status >= 500) {
          this.loginError = 'An internal server error occurred. Please try again later.';
        } else {
          this.loginError = error.error?.message || 'Google login failed. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  onFacebookLogin(): void {
    this.isLoading = true;
    this.loginError = '';

    this.loginService.facebookLogin().subscribe({
      next: (response) => {
        if (response && response.token) {
          this.router.navigate(['/home']);
        } else {
          this.loginError = 'Facebook login failed. Please try again.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Facebook login error:', error);
        if (error.status === 0) {
          this.loginError = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error.status >= 500) {
          this.loginError = 'An internal server error occurred. Please try again later.';
        } else {
          this.loginError = error.error?.message || 'Facebook login failed. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

}
