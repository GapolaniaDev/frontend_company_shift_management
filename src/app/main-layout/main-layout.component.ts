import {Component, OnInit, NgModule, Renderer2} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet, Router} from "@angular/router";
import {LoginService} from "../session/services/login.service";
import {MenuComponent} from "../core/components/menu/menu.component";
import {LoaderComponent} from "../core/components/loader/loader.component";
import {DarkModeService} from "../services/dark-mode/dark-mode.service";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    CommonModule,
    MenuComponent,
    LoaderComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  isLoggedIn: boolean | undefined;
  isDarkMode = false;
  menuOpen = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private renderer: Renderer2,
    private darkModeService: DarkModeService
  ) {

  }

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.updateTheme();
    this.isLoggedIn = this.loginService.isLoggedIn();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode ? 'true' : 'false');
    this.updateTheme();
    this.darkModeService.setDarkMode(this.isDarkMode); // Propaga el cambio al servicio
  }


  onMenuOpenChange(menuOpen: boolean) {
    this.menuOpen = menuOpen; // Actualizamos el estado de menuOpen
  }

  private updateTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }

  logout() {
    this.loginService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

}
