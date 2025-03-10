import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private userLocationSubject = new BehaviorSubject<google.maps.LatLngLiteral>({lat: 0, lng: 0});
  userLocation$: Observable<google.maps.LatLngLiteral> = this.userLocationSubject.asObservable();

  constructor() {
    this.trackUserLocation();
  }

  private trackUserLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(position => {
        const {latitude, longitude} = position.coords;
        const currentPosition: google.maps.LatLngLiteral = {lat: latitude, lng: longitude};
        this.userLocationSubject.next(currentPosition);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
