import {Injectable} from '@angular/core'
import {combineLatest, Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import {ShiftStateService} from "../shift-state/shift-state.service";
import {GeolocationService} from "../geolocation/geolocation.service";

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  constructor(
    private shiftStateService: ShiftStateService,
    private geolocationService: GeolocationService
  ) {
  }

  getMapData(radius: number): Observable<{
    center: google.maps.LatLngLiteral;
    buildingPosition: google.maps.LatLngLiteral,
    isWithinZone: boolean
  }> {
    return combineLatest([
      this.geolocationService.userLocation$,
      this.shiftStateService.buildingPosition$,
    ]).pipe(
      map(([userPosition, buildingPosition]) => {
        if (!userPosition || !buildingPosition) {
          return {center: {lat: 0, lng: 0}, buildingPosition: {lat: 0, lng: 0}, isWithinZone: false};
        }
        const isWithinZone = this.shiftStateService.isWithinRadius(
          userPosition,
          buildingPosition,
          radius
        );
        return {center: userPosition, buildingPosition, isWithinZone};
      })
    );
  }
}
