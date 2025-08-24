import {Component, OnDestroy, OnInit} from '@angular/core'
import {ShiftStateService} from "@core/services/shift-state/shift-state.service";
import {LoaderService} from "@core/services/loader.service";
import {Subscription} from 'rxjs'
import {CommonModule, NgIf} from "@angular/common";
import {MapsComponent} from "@features/shifts/components/maps/maps.component";
import {ClockComponent} from "@shared/components/clock/clock.component";
import {ShiftDetailsComponent} from "@features/shifts/components/shift-details/shift-details.component";
import {NoShiftDetailsComponent} from "@features/shifts/components/no-shift-details/no-shift-details.component";
import {SharedNgIconsModule} from "@shared/ng-icons.module";
import {ConfirmationModalComponent} from "@shared/components/confirmation-modal/confirmation-modal.component";
import {GeolocationService} from "@core/services/geolocation/geolocation.service";
import {ShiftCompletedComponent} from "@features/shifts/components/shift-completed/shift-completed.component";
import {Shift, ShiftState} from "@features/shifts/models/shift";

// Make ShiftState enum available for the template
const ShiftStateEnum = ShiftState;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    MapsComponent,
    ClockComponent,
    ShiftDetailsComponent,
    NoShiftDetailsComponent,
    ShiftCompletedComponent,
    SharedNgIconsModule,
    ConfirmationModalComponent
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  isShiftActive = false;
  isThereShift = false;
  isShiftJustCompleted = false;
  completedShift: Shift | null = null;
  shiftState: ShiftState = ShiftState.NOT_STARTED;
  ShiftState = ShiftStateEnum; // Make ShiftState enum available in the template
  private subscriptions: Subscription[] = [];
  userGeo: google.maps.LatLngLiteral = {lat: 0, lng: 0};

  constructor(
    private shiftStateService: ShiftStateService,
    private loaderService: LoaderService,
    private geolocationService: GeolocationService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.shiftStateService.isShiftActive$.subscribe((isShiftActive) => {
        this.isShiftActive = isShiftActive;
      }),

      this.shiftStateService.shiftState$.subscribe((state) => {
        this.shiftState = state;
        console.log('Current shift state:', state);
      }),

      this.shiftStateService.isThereShift$.subscribe((isThereShift) => {
        this.isThereShift = isThereShift;
      }),

      this.shiftStateService.shifts$.subscribe((shiftData) => {
        if (shiftData.success && shiftData.shift) {
          this.completedShift = shiftData.shift;
        }
      }),

      this.geolocationService.userLocation$.subscribe((coords) => {
        this.userGeo = coords;
      })
    );

    this.refreshShifts();
  }

  /**
   * Get the current shift data
   * @returns The current shift or null if not available
   */
  getCurrentShift(): Shift | null {
    const shiftData = this.shiftStateService.getCurrentShift();
    return shiftData.success ? shiftData.shift : null;
  }

  /**
   * Handle when a shift is completed (clock-off)
   */
  private handleShiftCompletion(): void {
    // Get the current shift data before showing completion screen
    const currentShiftData = this.shiftStateService.getCurrentShift();
    if (currentShiftData.success && currentShiftData.shift) {
      this.completedShift = currentShiftData.shift;
      this.isShiftJustCompleted = true;

      // Set a timeout to reset the completed state after showing the confirmation
      // This gives the user time to see the completion screen before going back to no-shift view
      setTimeout(() => {
        this.isShiftJustCompleted = false;
        // Refresh data to get the latest shift state
        this.refreshShifts();
      }, 10000);  // Show for 10 seconds
    }
  }

  /**
   * Refresh shifts data from the server
   */
  refreshShifts(): void {
    this.shiftStateService.fetchShiftsToday(
      () => this.loaderService.show(),
      () => this.loaderService.hide()
    );
  }

  /**
   * Handle action when user closes the shift summary screen
   */
  closeCompletedView(): void {
    // Set shiftState to NOT_STARTED to force UI update
    this.shiftStateService.setShiftState(ShiftState.NOT_STARTED);

    // Refresh the data to get the latest state from server
    this.refreshShifts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
