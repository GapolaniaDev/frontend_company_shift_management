import {Injectable} from '@angular/core'
import {BehaviorSubject, combineLatest, Observable} from 'rxjs'
import {ShiftsService} from "@features/shifts/data-access/shifts/shifts.service";
import {defaultShift, mapToShift, Shift, ShiftState} from "@features/shifts/models/shift";
import {finalize, map} from 'rxjs/operators'
import {GeoUtilsService} from "@core/services/geo-utils/geo-utils.service";
import {GeolocationService} from "@core/services/geolocation/geolocation.service";


@Injectable({
  providedIn: 'root',
})
export class ShiftStateService {
  private isShiftActiveSubject = new BehaviorSubject<boolean>(false);
  private isThereShiftSubject = new BehaviorSubject<boolean>(false);
  private buildingPositionSubject = new BehaviorSubject<google.maps.LatLngLiteral>({lat: 0, lng: 0});
  private clockOnPositionSubject = new BehaviorSubject<google.maps.LatLngLiteral>({lat: 0, lng: 0});
  private clockOffPositionSubject = new BehaviorSubject<google.maps.LatLngLiteral>({lat: 0, lng: 0});
  private shiftsSubject = new BehaviorSubject<{ success: boolean; shift: Shift | null }>({
    success: false,
    shift: {...defaultShift},
  });
  private isInsideBuildingZoneSubject = new BehaviorSubject<boolean>(false);
  private zoomSubject = new BehaviorSubject<number>(0); // Valor inicial del zoom
  private radiusSubject = new BehaviorSubject<number>(0);
  private shiftStateSubject = new BehaviorSubject<ShiftState>(ShiftState.NOT_STARTED);

  isShiftActive$: Observable<boolean> = this.isShiftActiveSubject.asObservable();
  isThereShift$: Observable<boolean> = this.isThereShiftSubject.asObservable();
  buildingPosition$: Observable<google.maps.LatLngLiteral> = this.buildingPositionSubject.asObservable();
  clockOnPosition$: Observable<google.maps.LatLngLiteral> = this.clockOnPositionSubject.asObservable();
  clockOffPosition$: Observable<google.maps.LatLngLiteral> = this.clockOffPositionSubject.asObservable();
  shifts$: Observable<{ success: boolean; shift: Shift | null }> = this.shiftsSubject.asObservable();
  isInsideBuildingZone$: Observable<boolean> = this.isInsideBuildingZoneSubject.asObservable();
  zoom$: Observable<number> = this.zoomSubject.asObservable();
  radius$: Observable<number> = this.radiusSubject.asObservable();
  shiftState$: Observable<ShiftState> = this.shiftStateSubject.asObservable();

  constructor(
    private shiftsService: ShiftsService,
    private geoUtilsService: GeoUtilsService,
    private geolocationService: GeolocationService
  ) {
  }

  updateZoneStatus(userPosition: google.maps.LatLngLiteral, buildingPosition: google.maps.LatLngLiteral, radius: number): void {
    const isWithinZone = this.isWithinRadius(userPosition, buildingPosition, radius);
    this.isInsideBuildingZoneSubject.next(isWithinZone);
  }

  isWithinRadius(
    userPosition: google.maps.LatLngLiteral,
    buildingPosition: google.maps.LatLngLiteral,
    radius: number
  ): boolean {
    const distance = this.geoUtilsService.calculateDistance(userPosition, buildingPosition);
    return distance <= radius;
  }

  fetchShiftsToday(showLoader: () => void, hideLoader: () => void): void {
    showLoader();

    this.shiftsService
      .getShiftsToday()
      .pipe(finalize(hideLoader))
      .subscribe(
        (data: { success: boolean; data: any | null }) => {
          const shift = data.success && data.data ? mapToShift(data.data) : null;
          this.setShifts({success: data.success, shift});

          if (
            data.success &&
            shift?.location_lat &&
            shift?.location_lng &&
            shift?.radius &&
            shift?.zoom
          ) {
            // Update the shift state subject
            if (shift.state !== undefined && shift.state !== null) {
              this.shiftStateSubject.next(shift.state);

              // Update isShiftActive based on state (for backward compatibility)
              // STARTED = 1 means the shift is active
              // FINISHED = 2 means the shift is no longer active
              this.isShiftActiveSubject.next(shift.state === ShiftState.STARTED);
            } else {
              // Legacy fallback based on clock_off_lat
              this.isShiftActiveSubject.next(shift?.clock_off_lat != 0);

              // Set state based on clock fields for compatibility with existing code
              if (shift?.clock_on_time && !shift?.clock_off_time) {
                this.shiftStateSubject.next(ShiftState.STARTED);
              } else if (shift?.clock_off_time) {
                this.shiftStateSubject.next(ShiftState.FINISHED);
              } else {
                this.shiftStateSubject.next(ShiftState.NOT_STARTED);
              }
            }

            this.setBuildingPosition({
              lat: Number(shift.location_lat),
              lng: Number(shift.location_lng),
            });
            this.setClockOnPosition({
              lat: Number(shift.clock_on_lat),
              lng: Number(shift.clock_on_lng),
            });
            this.setClockOffPosition({
              lat: Number(shift.clock_off_lat),
              lng: Number(shift.clock_off_lng),
            });

            this.zoomSubject.next(shift!.zoom);
            this.radiusSubject.next(shift!.radius);

            combineLatest([
              this.geolocationService.userLocation$,
              this.buildingPosition$
            ]).subscribe(([userPosition, buildingPosition]) => {
              if (userPosition && buildingPosition) {
                this.updateZoneStatus(userPosition, buildingPosition, shift!.radius!);
              }
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

    // Update state based on isActive for backward compatibility
    if (isActive) {
      // Si estamos activando el turno, asegurémonos de que tenga un local_clock_on_time
      this.shiftStateSubject.next(ShiftState.STARTED);

      // Si no hay local_clock_on_time, establecerlo temporalmente
      const currentShift = this.shiftsSubject.getValue().shift;
      if (currentShift && !currentShift.local_clock_on_time) {
        const shiftWithLocalTime = {
          ...currentShift,
          local_clock_on_time: new Date().toISOString()
        };
        this.setShifts({
          success: true,
          shift: shiftWithLocalTime
        });
      }
    } else {
      const currentShift = this.shiftsSubject.getValue().shift;
      if (currentShift?.clock_off_time) {
        this.shiftStateSubject.next(ShiftState.FINISHED);
      } else {
        this.shiftStateSubject.next(ShiftState.NOT_STARTED);
      }
    }
  }

  public setShiftState(state: ShiftState): void {
    this.shiftStateSubject.next(state);

    // Update isShiftActive based on state for backward compatibility
    this.isShiftActiveSubject.next(state === ShiftState.STARTED);

    // Si estamos estableciendo el estado a STARTED y no hay local_clock_on_time
    if (state === ShiftState.STARTED) {
      const currentShift = this.shiftsSubject.getValue().shift;
      if (currentShift && !currentShift.local_clock_on_time) {
        const shiftWithLocalTime = {
          ...currentShift,
          local_clock_on_time: new Date().toISOString()
        };
        this.setShifts({
          success: true,
          shift: shiftWithLocalTime
        });
        console.log('Added temporary local_clock_on_time:', shiftWithLocalTime.local_clock_on_time);
      }
    }
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

  public setInsideBuildingZoneStatus(isInside: boolean): void {
    this.isInsideBuildingZoneSubject.next(isInside);
  }

  getCurrentShift(): { success: boolean; shift: Shift | null } {
    return this.shiftsSubject.getValue();
  }

  /**
   * Gets the clock-on timestamp from the current shift
   * @returns Observable with the clock-on time as a string, or null if no clock-on time
   */
  getClockOnTime(): Observable<string | null> {
    return this.shifts$.pipe(
      map((data) => {
        if (data.success && data.shift) {
          // Primero intentamos usar local_clock_on_time (hora local del usuario)
          if (data.shift.local_clock_on_time) {
            console.log('Retrieved local_clock_on_time from shift:', data.shift.local_clock_on_time);
            return data.shift.local_clock_on_time;
          }

          // Si no está disponible, usamos clock_on_time (hora del servidor)
          if (data.shift.clock_on_time) {
            console.log('Retrieved clock_on_time from shift:', data.shift.clock_on_time);
            return data.shift.clock_on_time;
          }
        }

        console.warn('No clock-on time found in shift data');
        return null;
      })
    );
  }

}
