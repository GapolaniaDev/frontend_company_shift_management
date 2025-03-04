import {Component, OnDestroy} from '@angular/core';
import {DatePipe, NgClass} from "@angular/common";
import {ShiftStateService} from "../../../services/shift-state/shift-state.service";
import {Shift} from '../../../models/shift';
import {Subscription} from 'rxjs';
import {ConfirmationModalService} from "../../../services/confirmation-modal/confirmation-modal.service";
import {ShiftsService} from "../../../services/shifts/shifts.service";
import {LoaderService} from "../../../services/loader/loader.service";
import {GeolocationService} from "../../../services/geolocation/geolocation.service";

@Component({
  selector: 'app-shift-details',
  standalone: true,
  imports: [
    DatePipe,
    NgClass
  ],
  templateUrl: './shift-details.component.html',
  styleUrl: './shift-details.component.css'
})
export class ShiftDetailsComponent implements OnDestroy {
  shifts: { success: boolean; shift: Shift | null } = {success: false, shift: null};
  isShiftActive: boolean = false;
  isInsideBuildingZone: boolean = false;
  userLocation: google.maps.LatLngLiteral = {lat: 0, lng: 0};

  private subscriptions: Subscription = new Subscription();

  constructor(
    private shiftStateService: ShiftStateService,
    private confirmationModal: ConfirmationModalService,
    private shiftsService: ShiftsService,
    private loaderService: LoaderService,
    private geolocationService: GeolocationService,
  ) {
    this.subscriptions.add(
      this.shiftStateService.shifts$.subscribe(shifts => {
        this.shifts = shifts;
      })
    );

    this.subscriptions.add(
      this.shiftStateService.isShiftActive$.subscribe(isActive => {
        this.isShiftActive = isActive;
      })
    );

    this.subscriptions.add(
      this.shiftStateService.isInsideBuildingZone$.subscribe(isInside => {
        this.isInsideBuildingZone = isInside;
      })
    );

    this.geolocationService.userLocation$.subscribe((coords) => {
      this.userLocation = coords;
    });

  }

  toggleShift(): void {
    const actionType = this.isShiftActive ? 'clock_off' : 'clock_on';
    const confirmationText = `Are you sure you want to ${actionType.replace('_', ' ')}?`;
    this.confirmationModal.open(
      confirmationText,
      () => this.handleShiftAction(actionType),
      () => console.log('Action cancelled')
    );
  }

  private handleShiftAction(actionType: 'clock_on' | 'clock_off'): void {
    this.loaderService.show();
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }
    const shift = this.shiftStateService.getCurrentShift().shift;
    if (!shift?.id) {
      console.error('Shift ID not found.');
      return;
    }
    this.shiftsService.updateClockPosition(shift.id, this.userLocation.lat, this.userLocation.lng, actionType).subscribe({
      next: (response: any) => {
        console.log('next');
        if (response.success) {
          console.log(response.message);
          this.shiftStateService.setShiftActive(actionType === 'clock_on');
        }
      },
      error: (error) => {
        console.log('error');
        if (error.status === 403) {
          console.error('Error: Unauthorized.');
        } else if (error.status === 422) {
          console.error('Error:', error.error.error);
        }
        this.loaderService.hide();
      },
      complete: () => {
        this.loaderService.hide();
        console.log('Request completed');
      }
    });
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
