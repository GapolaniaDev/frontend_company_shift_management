import {Component} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {JsonPipe, NgClass, NgIf, CommonModule} from '@angular/common';
import {ShiftsService} from '../../../services/shifts/shifts.service';
import {Shift, defaultShift} from '../../../models/shift';
import {MapsComponent} from '../maps/maps.component';
import {LoaderService} from "../../../services/loader/loader.service";
import {finalize} from "rxjs";
import {DarkModeService} from "../../../services/dark-mode/dark-mode.service";

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
  isShiftActive: boolean = false;
  isThereShift: boolean = false;
  mapCenter = {lat: 0, lng: 0}; // Coordenadas iniciales
  mapZoom = 17;
  mapRadius = 50;
  mapKey: string = 'initial-map';
  loadingMap: boolean = false;
  mapOptions: google.maps.MapOptions = {
    styles: [], // Inicialmente sin estilos
    disableDefaultUI: false,
  };
  shifts: { success: boolean; shift: Shift | null } = {
    success: false,
    shift: {...defaultShift}
  };


  constructor(
    private shiftsService: ShiftsService,
    private sanitizer: DomSanitizer,
    private loaderService: LoaderService
  ) {
  }

  /**
   * Lifecycle hook - Initialize the component
   */
  ngOnInit() {
    this.getShiftsToday();


  }

  refreshMap(): void {
    this.mapKey = `map-${Date.now()}`; // Generate a new unique key
    console.log('Map key:', this.mapKey);
  }

  /**
   * Calls the service to retrieve the current shift
   */
  getShiftsToday(): void {
    this.loaderService.show();
    this.shiftsService.getShiftsToday().pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    ).subscribe(
      (data: { success: boolean; shift: Shift | null }) => {
        this.shifts = data;

        if (data.success && data.shift?.location_lat && data.shift?.location_lng) {
          // Update the map's center to the shift's location
          this.mapCenter = {
            lat: Number(data.shift.location_lat),
            lng: Number(data.shift.location_lng)
          };
          this.isThereShift = true;
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
}
