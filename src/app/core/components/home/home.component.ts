import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink, NgClass
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isShiftActive: boolean = false; // State variable to track shift status

  /**
   * Toggles the shift status and updates the button's state and color.
   */
  toggleShift(): void {
    this.isShiftActive = !this.isShiftActive;
    console.log(this.isShiftActive ? 'Shift started' : 'Shift ended');
  }
}
