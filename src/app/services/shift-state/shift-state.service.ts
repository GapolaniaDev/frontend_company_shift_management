import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ShiftsService} from '../shifts/shifts.service';
import {Shift, defaultShift, mapToShift} from '../../models/shift';
import {finalize} from 'rxjs/operators';
import {GeoUtilsService} from "../geo-utils/geo-utils.service";
import {GeolocationService} from "../geolocation/geolocation.service";
import {combineLatest} from 'rxjs';


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

  isShiftActive$: Observable<boolean> = this.isShiftActiveSubject.asObservable();
  isThereShift$: Observable<boolean> = this.isThereShiftSubject.asObservable();
  buildingPosition$: Observable<google.maps.LatLngLiteral> = this.buildingPositionSubject.asObservable();
  clockOnPosition$: Observable<google.maps.LatLngLiteral> = this.clockOnPositionSubject.asObservable();
  clockOffPosition$: Observable<google.maps.LatLngLiteral> = this.clockOffPositionSubject.asObservable();
  shifts$: Observable<{ success: boolean; shift: Shift | null }> = this.shiftsSubject.asObservable();
  isInsideBuildingZone$: Observable<boolean> = this.isInsideBuildingZoneSubject.asObservable();
  zoom$: Observable<number> = this.zoomSubject.asObservable();
  radius$: Observable<number> = this.radiusSubject.asObservable();

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
          console.log(data.success,
            shift?.location_lat,
            shift?.location_lng,
            shift?.radius,
            shift?.zoom)
          if (
            data.success &&
            shift?.location_lat &&
            shift?.location_lng &&
            shift?.radius &&
            shift?.zoom
          ) {

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
            this.isShiftActiveSubject.next(shift?.clock_off_lat != null);

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


}
