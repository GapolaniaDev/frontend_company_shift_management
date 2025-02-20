import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from "@angular/router";
import { JsonPipe, NgClass, NgIf, CommonModule } from "@angular/common";
import { ShiftsService } from "../../../services/shifts/shifts.service";
import { Shift, defaultShift } from "../../../models/shift";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgClass, JsonPipe, NgIf, CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isShiftActive: boolean = false; // Shift status
  shifts: { success: boolean; shift: Shift | null } = {
    success: false,
    shift: { ...defaultShift }
  };
  location_lat: number = 0; // Latitude of the shift location
  location_lng: number = 0; // Longitude of the shift location
  userLatitude: number | null = null; // New variable: Latitude of the user
  userLongitude: number | null = null; // New variable: Longitude of the user
  mapUrl: SafeResourceUrl | null = null; // New variable for the secure map URL

  constructor(private shiftsService: ShiftsService, private sanitizer: DomSanitizer) {}

  /**
   * Takes the coordinates and constructs a secure URL for the iframe
   */
  private updateMapUrl(): void {
    if (this.location_lat && this.location_lng) {
      const rawUrl = `https://www.google.com/maps?q=${this.location_lat},${this.location_lng}&z=13&output=embed`;
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl); // Sanitizes the URL
    }
  }

  /**
   * Gets the user's location from the browser
   */
  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Updates the variables with the user's location
          this.userLatitude = position.coords.latitude;
          this.userLongitude = position.coords.longitude;

          // Logs the coordinates to the console
          console.log('User location:');
          console.log(`Latitude: ${this.userLatitude}`);
          console.log(`Longitude: ${this.userLongitude}`);
        },
        (error) => {
          // Handles errors
          console.error('Error retrieving location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  /**
   * Calls the service to get the current shift
   */
  getShiftsToday(): void {
    this.shiftsService.getShiftsToday().subscribe(
      (data: { success: boolean; shift: Shift | null }) => {
        this.shifts = data;

        if (data.success && data.shift?.location_lat && data.shift?.location_lng) {
          this.location_lat = data.shift.location_lat;
          this.location_lng = data.shift.location_lng;

          // Updates the map URL when the coordinates change
          this.updateMapUrl();
        } else {
          console.warn('Shift data is unavailable or incomplete.');
        }
      },
      error => {
        console.error('Error fetching shifts:', error);

        // Resets values in case of error
        this.shifts = { success: false, shift: { ...defaultShift } };
        this.mapUrl = null; // Removes any previous URL
      }
    );
  }

  /**
   * Toggles the shift status and updates the button's state and color.
   */
  toggleShift(): void {
    this.isShiftActive = !this.isShiftActive;
    console.log(this.isShiftActive ? 'Shift started' : 'Shift ended');
  }

  ngOnInit() {
    console.log('Home component initialized');
    this.getShiftsToday(); // Calls the service to retrieve the shifts data
    this.getUserLocation(); // Calls the method to get the user's location
  }
}
