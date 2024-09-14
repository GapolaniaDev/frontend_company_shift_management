import {Component, OnInit,NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterOutlet, Router} from "@angular/router";
import {LoginService} from "../session/services/login.service";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  isLoggedIn: boolean | undefined;

  constructor(private loginService: LoginService, private router: Router) {

  }

  ngOnInit() {
    this.isLoggedIn = this.loginService.isLoggedIn();
  }

  logout() {
    this.loginService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

}
