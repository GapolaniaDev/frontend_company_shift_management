import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [],
  templateUrl: './public-home.component.html',
  styleUrl: './public-home.component.css'
})
export class PublicHomeComponent {
  constructor(private router: Router) {
  }

  // Método que navega a la ruta de login
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
