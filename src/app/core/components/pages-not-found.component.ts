import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-pages-not-found',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './pages-not-found.component.html',
  styleUrl: './pages-not-found.component.css'
})
export class PagesNotFoundComponent {

}
