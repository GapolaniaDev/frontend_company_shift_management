import { Component, OnDestroy, OnInit } from '@angular/core'
import { DatePipe, NgClass, NgIf } from "@angular/common";
import { ShiftStateService } from "@core/services/shift-state/shift-state.service";
import { Shift, ShiftState } from "@features/shifts/models/shift";
import { Subscription } from 'rxjs'
import { ConfirmationModalService } from "@core/services/confirmation-modal/confirmation-modal.service";
import { ShiftsService } from "@core/services/shifts/shifts.service";
import { LoaderService } from "@core/services/loader.service";
import { GeolocationService } from "@core/services/geolocation/geolocation.service";
import { TimezoneService } from "@core/services/timezone/timezone.service";

// Make ShiftState enum available for the template
const ShiftStateEnum = ShiftState;

@Component({
  selector: 'app-shift-details',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    NgIf,
    JsonPipe
  ],
  templateUrl: './shift-details.component.html',
  styleUrl: './shift-details.component.css'
})
export class ShiftDetailsComponent implements OnInit, OnDestroy {
  shifts: { success: boolean; shift: Shift | null } = {success: false, shift: null};
  isShiftActive: boolean = false;
  isInsideBuildingZone: boolean = false;
  userLocation: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  timezone: string = 'UTC'
  shiftState: ShiftState = ShiftState.NOT_STARTED;
  ShiftState = ShiftStateEnum; // Make ShiftState enum available in the template

  private subscriptions: Subscription = new Subscription();

  constructor(
    private shiftStateService: ShiftStateService,
    private confirmationModal: ConfirmationModalService,
    private shiftsService: ShiftsService,
    private loaderService: LoaderService,
    private geolocationService: GeolocationService,
    private timezoneService: TimezoneService
  ) {
    // Subscribe to timezone changes
    this.subscriptions.add(
      this.timezoneService.timezone$.subscribe(timezone => {
        this.timezone = timezone;
        console.log(`Timezone in ShiftDetailsComponent: ${timezone}`);
      })
    );
  }

  ngOnInit(): void {
    // Get shift data
    this.subscriptions.add(
      this.shiftStateService.shifts$.subscribe(shifts => {
        this.shifts = shifts;
      })
    );

    // Get shift state (active/inactive)
    this.subscriptions.add(
      this.shiftStateService.isShiftActive$.subscribe(isActive => {
        this.isShiftActive = isActive;
      })
    );

    // Get shift state enum value (NOT_STARTED, STARTED, FINISHED)
    this.subscriptions.add(
      this.shiftStateService.shiftState$.subscribe(state => {
        this.shiftState = state;
        console.log('ShiftDetails - Current shift state:', state);
      })
    );

    // Get building zone status
    this.subscriptions.add(
      this.shiftStateService.isInsideBuildingZone$.subscribe(isInside => {
        this.isInsideBuildingZone = isInside;
      })
    );

    // Get user location
    this.subscriptions.add(
      this.geolocationService.userLocation$.subscribe((coords) => {
        this.userLocation = coords;
      })
    );
  }

  /**
   * Toggle shift state (clock on/off)
   */
  toggleShift(): void {
    const actionType = this.isShiftActive ? 'clock_off' : 'clock_on'
    const confirmationText = `Are you sure you want to ${actionType.replace('_', ' ')}?`;
    this.confirmationModal.open(
      confirmationText,
      () => this.handleShiftAction(actionType),
      () => console.log('Action cancelled')
    );
  }

  /**
   * Handle shift action (clock on/off) after confirmation
   * @param actionType The type of action (clock_on or clock_off)
   */
  private handleShiftAction(actionType: 'clock_on' | 'clock_off'): void {
    this.loaderService.show();

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      this.loaderService.hide();
      return;
    }

    // Get current shift
    const shift = this.shiftStateService.getCurrentShift().shift;
    if (!shift?.id) {
      console.error('Shift ID not found.');
      this.loaderService.hide();
      return;
    }

    // Update clock position with user location
    // TimezoneService is used inside ShiftsService automatically
    this.shiftsService.updateClockPosition(
      shift.id,
      this.userLocation.lat,
      this.userLocation.lng,
      actionType
    ).subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log('Clock update response:', response);

          // Actualizar el estado del turno según el tipo de acción
          if (actionType === 'clock_on') {
            this.shiftStateService.setShiftState(ShiftState.STARTED);
          } else {
            this.shiftStateService.setShiftState(ShiftState.FINISHED);
          }

          // Actualizar la información del turno para obtener los nuevos tiempos
          this.shiftStateService.fetchShiftsToday(
            () => console.log('Refreshing shift data after clock action...'),
            () => console.log('Shift data refreshed after clock action')
          );

          // Para compatibilidad con código existente
          this.shiftStateService.setShiftActive(actionType === 'clock_on');
        }
      },
      error: (error) => {
        if (error.status === 403) {
          console.error('Error: Unauthorized.');
        } else if (error.status === 422) {
          console.error('Error:', error.error.error);
        } else {
          console.error('Error updating clock:', error);
        }
        this.loaderService.hide();
      },
      complete: () => {
        this.loaderService.hide();
        console.log('Clock update request completed');
      }
    });
  }

  /**
   * Get formatted time string for display
   * Backend sends UTC dates with Z suffix, but specifies target timezone separately
   */
  getFormattedTime(dateString: string, timezoneString: string): string {
    if (!dateString) return '';

    try {
      // Backend format: "2025-08-07T14:30:00.000000Z" (UTC) with timezone "Australia/Adelaide"
      // We need to convert from UTC to the specified timezone

      // Parse the UTC date string (the Z indicates it's UTC)
      const utcDate = new Date(dateString);

      // Log for debugging
      console.log(`Converting UTC date: ${dateString} to timezone: ${timezoneString}`);
      console.log(`UTC Date object: ${utcDate}`);

      // Format the time in the specified timezone
      const formattedTime = utcDate.toLocaleTimeString('en-US', {
        timeZone: timezoneString || 'Australia/Adelaide',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      console.log(`Formatted time: ${formattedTime}`);
      return formattedTime;

    } catch (error) {
      console.error('Error formatting time:', error, { dateString, timezoneString });
      return dateString;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
