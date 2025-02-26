import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShiftsService } from '../shifts/shifts.service';
import { Shift, defaultShift } from '../../models/shift';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ShiftStateService {
  private isShiftActiveSubject = new BehaviorSubject<boolean>(false);
  private isThereShiftSubject = new BehaviorSubject<boolean>(false);
  private buildingPositionSubject = new BehaviorSubject<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  private clockOnPositionSubject = new BehaviorSubject<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  private clockOffPositionSubject = new BehaviorSubject<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  private shiftsSubject = new BehaviorSubject<{ success: boolean; shift: Shift | null }>({
    success: false,
    shift: { ...defaultShift },
  });

  isShiftActive$: Observable<boolean> = this.isShiftActiveSubject.asObservable();
  isThereShift$: Observable<boolean> = this.isThereShiftSubject.asObservable();
  buildingPosition$: Observable<google.maps.LatLngLiteral> = this.buildingPositionSubject.asObservable();
  clockOnPosition$: Observable<google.maps.LatLngLiteral> = this.clockOnPositionSubject.asObservable();
  clockOffPosition$: Observable<google.maps.LatLngLiteral> = this.clockOffPositionSubject.asObservable();
  shifts$: Observable<{ success: boolean; shift: Shift | null }> = this.shiftsSubject.asObservable();

  constructor(private shiftsService: ShiftsService) {}

  fetchShiftsToday(showLoader: () => void, hideLoader: () => void): void {
    showLoader();

    this.shiftsService
      .getShiftsToday()
      .pipe(finalize(hideLoader))
      .subscribe(
        (data: { success: boolean; shift: Shift | null }) => {
          this.setShifts(data);

          if (data.success && data.shift?.location_lat && data.shift?.location_lng) {
            this.setBuildingPosition({
              lat: Number(data.shift.location_lat),
              lng: Number(data.shift.location_lng),
            });
            this.setClockOnPosition({
              lat: Number(data.shift.clock_on_lat),
              lng: Number(data.shift.clock_on_lng),
            });
            this.setClockOffPosition({
              lat: Number(data.shift.clock_off_lat),
              lng: Number(data.shift.clock_off_lng),
            });
            this.setThereShift(true);
          } else {
            this.setThereShift(false);
          }
        },
        (error) => {
          console.error('Error fetching shifts:', error);
          this.setThereShift(false);
        }
      );
  }

  public setShiftActive(isActive: boolean): void {
    this.isShiftActiveSubject.next(isActive);
  }

  private setThereShift(isThereShift: boolean): void {
    this.isThereShiftSubject.next(isThereShift);
  }

  private setBuildingPosition(position: google.maps.LatLngLiteral): void {
    this.buildingPositionSubject.next(position);
  }

  private setClockOnPosition(position: google.maps.LatLngLiteral): void {
    this.clockOnPositionSubject.next(position);
  }

  private setClockOffPosition(position: google.maps.LatLngLiteral): void {
    this.clockOffPositionSubject.next(position);
  }

  private setShifts(shifts: { success: boolean; shift: Shift | null }): void {
    this.shiftsSubject.next(shifts);
  }
}
