import {Component, OnInit} from '@angular/core';
import {RouterLink, Router} from "@angular/router";
import {ReactiveFormsModule, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgIf} from "@angular/common";
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

  constructor(private loginService: LoginService, private router: Router) {
  }

  ngOnInit(): void {

  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe(success => {
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.loginError = 'Login failed. Please check your email and password.';
        }
      });
    }
  }
}
