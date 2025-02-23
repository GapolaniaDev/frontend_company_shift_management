import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MapService {
  constructor() {
  }

  isPositionValid(position: google.maps.LatLngLiteral): boolean {
    return position && Object.keys(position).length > 0 && 'lat' in position && 'lng' in position;
  }

  getDarkMapStyles(): google.maps.MapTypeStyle[] {
    return [
      {elementType: "geometry", stylers: [{color: "#242f3e"}]},
      {elementType: "labels.text.stroke", stylers: [{color: "#242f3e"}]},
      {elementType: "labels.text.fill", stylers: [{color: "#746855"}]},
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{color: "#d59563"}],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{color: "#d59563"}],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{color: "#263c3f"}],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{color: "#6b9a76"}],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{color: "#38414e"}],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{color: "#212a37"}],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{color: "#9ca5b3"}],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{color: "#746855"}],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{color: "#1f2835"}],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{color: "#f3d19c"}],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{color: "#2f3948"}],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{color: "#d59563"}],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{color: "#17263c"}],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{color: "#515c6d"}],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{color: "#17263c"}],
      },
    ];
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3;
    const rad = (x: number) => (x * Math.PI) / 180;

    const dLat = rad(lat2 - lat1);
    const dLng = rad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Distancia en metros
  }
}
