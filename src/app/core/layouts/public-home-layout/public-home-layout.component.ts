import {Component} from '@angular/core'
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-public-home-layout',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './public-home-layout.component.html',
  styleUrl: './public-home-layout.component.css'
})
export class PublicHomeLayoutComponent {

}
