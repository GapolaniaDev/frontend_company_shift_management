import {Component} from '@angular/core'
import {RouterLink, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MenuComponent} from "../../components/menu/menu.component";

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
