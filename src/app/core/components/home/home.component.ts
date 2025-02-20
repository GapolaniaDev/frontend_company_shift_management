import {Component} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {JsonPipe, NgClass, NgIf, CommonModule} from '@angular/common';
import {ShiftsService} from '../../../services/shifts/shifts.service';
import {Shift, defaultShift} from '../../../models/shift';
import {MapsComponent} from '../maps/maps.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgClass, JsonPipe, NgIf, CommonModule, MapsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isShiftActive: boolean = false; // Indicates whether the shift is currently active
  shifts: { success: boolean; shift: Shift | null } = {
    success: false,
    shift: {...defaultShift}
  };

  loadingMap: boolean = false; // Indicates whether the map is loading

  // Variables passed to the map component
  mapCenter = {lat: 0, lng: 0}; // Default location
  mapZoom = 17; // Default zoom level
  mapRadius = 50; // Default circle radius
  mapKey: string = 'initial-map';// Unique key to identify the map instance


  constructor(private shiftsService: ShiftsService, private sanitizer: DomSanitizer) {
  }

  refreshMap(): void {
    this.mapKey = `map-${Date.now()}`; // Generate a new unique key
    console.log('Map key:', this.mapKey);
  }

  /**
   * Calls the service to retrieve the current shift
   */
  getShiftsToday(): void {
    this.shiftsService.getShiftsToday().subscribe(
      (data: { success: boolean; shift: Shift | null }) => {
        this.shifts = data;

        if (data.success && data.shift?.location_lat && data.shift?.location_lng) {
          // Update the map's center to the shift's location
          this.mapCenter = {
            lat: Number(data.shift.location_lat),
            lng: Number(data.shift.location_lng)
          };

          console.log('Map center::::::', this.mapCenter);

          // (Optional) Adjust zoom or radius if needed
          this.mapZoom = 17; // Default or set as needed
          this.mapRadius = 50; // Adjust the radius if required
          this.refreshMap();
        } else {
          console.warn('Shift data is unavailable or incomplete.');
        }
      },
      error => {
        console.error('Error fetching shifts:', error);

        // Reset values in case of error
        this.shifts = {success: false, shift: {...defaultShift}};
        this.loadingMap = true; // Indicates the issues in loading the map
      }
    );
  }

  /**
   * Toggles the shift's status and updates the state and the button's color.
   */
  toggleShift(): void {
    this.isShiftActive = !this.isShiftActive;
    console.log(this.isShiftActive ? 'Shift started' : 'Shift ended');
  }

  /**
   * Lifecycle hook - Initialize the component
   */
  ngOnInit() {
    console.log('Home component initialized');
    this.getShiftsToday(); // Load the shift's data on initialization
  }
}
