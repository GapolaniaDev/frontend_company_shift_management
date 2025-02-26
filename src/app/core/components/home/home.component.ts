import {Component} from '@angular/core';
import {NgClass, NgIf, CommonModule} from '@angular/common';
import {ShiftsService} from '../../../services/shifts/shifts.service';
import {Shift, defaultShift} from '../../../models/shift';
import {MapsComponent} from '../maps/maps.component';
import {LoaderService} from "../../../services/loader/loader.service";
import {finalize} from "rxjs";
import {SharedNgIconsModule} from "../../../shared/ng-icons.module";
import {MapService} from "../../../services/map/map.service";
import {ClockService} from "../../../services/clock/clock.service";
import {ClockComponent} from "../clock/clock/clock.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgClass, NgIf, CommonModule, MapsComponent, SharedNgIconsModule, ClockComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isShiftActive: boolean = false;
  isThereShift: boolean = false;
  buildingPosition = {lat: 0, lng: 0};
  clockOnPosition = {lat: 0, lng: 0};
  clockOffPosition = {lat: 0, lng: 0};

  timerInterval: any = null;
  clockHours: string = '00';
  clockMinutes: string = '00';
  clockSeconds: string = '00';
  startTime: number | null = null;
  period: string = '';
  currentDate: string = '';


  mapZoom = 17;
  mapRadius = 50;
  mapKey: string = 'initial-map';
  loadingMap: boolean = false;
  mapOptions: google.maps.MapOptions = {
    styles: [],
    disableDefaultUI: false,
  };
  shifts: { success: boolean; shift: Shift | null } = {
    success: false,
    shift: {...defaultShift}
  };

  isInsideBuildingZone: boolean = false;
  currentPosition: google.maps.LatLngLiteral = {lat: 0, lng: 0};


  protected readonly expandIcon = 'heroArrowsPointingOutSolid';


  constructor(
    private clockService: ClockService,
    private shiftsService: ShiftsService,
    private loaderService: LoaderService,
    private mapService: MapService
  ) {
  }

  ngOnInit(): void {
    this.getShiftsToday();
    this.startClock();
  }

  ngOnDestroy(): void {
    this.stopClock();
  }

  startClock(): void {
    this.clockService.startClock(this.isShiftActive, this.startTime, (time) => {
      this.clockHours = time.hours;
      this.clockMinutes = time.minutes;
      this.clockSeconds = time.seconds;
      if (time.period) this.period = time.period;
      if (time.currentDate) this.currentDate = time.currentDate;
    });
  }

  stopClock(): void {
    this.clockService.stopClock();
  }

  updateUserPosition(position: google.maps.LatLngLiteral): void {
    this.currentPosition = position;
    this.isInsideBuildingZone = this.mapService.isWithinRadius(position, this.buildingPosition, this.mapRadius);
  }

  refreshMap(): void {
    this.mapKey = `map-${Date.now()}`;
    this.updateUserPosition(this.currentPosition);
  }

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
          this.buildingPosition = {
            lat: Number(data.shift.location_lat),
            lng: Number(data.shift.location_lng)
          };
          this.clockOnPosition = {
            lat: Number(data.shift.clock_on_lat),
            lng: Number(data.shift.clock_on_lng)
          };
          this.clockOffPosition = {
            lat: Number(data.shift.clock_off_lat),
            lng: Number(data.shift.clock_off_lng)
          };
          this.isThereShift = true;
          this.mapZoom = 17; // Default or set as needed
          this.mapRadius = 50; // Adjust the radius if required
          this.refreshMap();
        } else {
          console.warn('Shift data is unavailable or incomplete.');
        }
      },
      error => {
        console.error('Error fetching shifts:', error);
        this.shifts = {success: false, shift: {...defaultShift}};
        this.loadingMap = true; // Indicates the issues in loading the map
      }
    );
  }

  toggleShift(): void {
    this.isShiftActive = !this.isShiftActive;
    if (this.isShiftActive) {
      this.startClock();
    } else {
      this.stopClock();
    }
  }
}
