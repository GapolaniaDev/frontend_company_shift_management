import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeoUtilsService {
  calculateDistance(
    position1: google.maps.LatLngLiteral,
    position2: google.maps.LatLngLiteral
  ): number {
    const R = 6371e3; // Radius of Earth in meters
    const φ1 = (position1.lat * Math.PI) / 180;
    const φ2 = (position2.lat * Math.PI) / 180;
    const Δφ = ((position2.lat - position1.lat) * Math.PI) / 180;
    const Δλ = ((position2.lng - position1.lng) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
