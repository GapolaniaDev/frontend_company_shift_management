import {Component} from '@angular/core'
import {Router, RouterModule, RouterOutlet} from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private router: Router) {
  }

  title = 'frontend_company_shift_management'

  goToAbout() {
    this.router.navigate(['/home']);
  }


}
