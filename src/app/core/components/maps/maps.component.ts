import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {GoogleMap, MapCircle, MapMarker} from "@angular/google-maps";
import {DarkModeService} from "../../../services/dark-mode/dark-mode.service";
import {NgIf} from "@angular/common";
import {MapService} from "../../../services/map/map.service";
import {ICON_CLOCK_ON, ICON_CLOCK_OFF, ICON_USER_LOCATION, BUILDING_ICON} from "../menu/constants/map.constants";


@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [
    GoogleMap,
    MapMarker,
    MapCircle,
    NgIf
  ],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'] // Fixed typo from `styleUrl` to `styleUrls`
})
export class MapsComponent implements OnChanges {

  // Input properties to receive map data from parent component
  @Input() center!: google.maps.LatLngLiteral; // Coordinates of the map center
  @Output() positionChanged = new EventEmitter<google.maps.LatLngLiteral>();
  @Input() zoom!: number; // Zoom level
  @Input() radius!: number; // Radius for the circle
  @Input() key!: string;
  @ViewChild(GoogleMap) map!: GoogleMap;
  @Input() options!: google.maps.MapOptions;
  @Input() buildingPosition: google.maps.LatLngLiteral = this.center;
  @Input() clockOnPosition!: google.maps.LatLngLiteral;
  @Input() clockOffPosition!: google.maps.LatLngLiteral;
  protected readonly ICON_CLOCK_ON = ICON_CLOCK_ON;
  protected readonly ICON_CLOCK_OFF = ICON_CLOCK_OFF;
  protected readonly ICON_USER_LOCATION = ICON_USER_LOCATION;
  protected readonly BUILDING_ICON = BUILDING_ICON;


  markerOptions: google.maps.MarkerOptions = {draggable: false};
  circleOptions: google.maps.CircleOptions = {
    fillColor: 'green', // Lighter green for the fill color
    fillOpacity: 0.5, // Adjust the opacity for the fill
    strokeColor: '#006400', // Darker green for the border (HEX code for "dark green")
    strokeOpacity: 1.0, // Fully opaque border
    strokeWeight: 2, // Slightly thicker border for better visibility
    clickable: false,
    editable: false,
    zIndex: 1
  };
  trackerId: number | null = null;

  constructor(private darkModeService: DarkModeService, private mapService: MapService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['center']) {
      this.updateCircleColor();
    }
  }

  ngOnInit(): void {
    this.getUserLocation();
    this.applyInitialDarkMode();
    this.darkModeService.isDarkMode$.subscribe((isDarkMode) => {
      this.updateMapStyles(isDarkMode);
    });
    this.startLocationTracking();
  }

  isPositionValid(position: google.maps.LatLngLiteral): boolean {
    return this.mapService.isPositionValid(position);
  }

  private applyInitialDarkMode(): void {
    const isDarkMode = this.darkModeService.getDarkMode();
    this.updateMapStyles(isDarkMode);
  }

  private updateMapStyles(isDarkMode: boolean): void {
    const darkMapStyles: google.maps.MapTypeStyle[] = this.mapService.getDarkMapStyles();
    this.options = {
      ...this.options,
      styles: isDarkMode ? darkMapStyles : [],
    };
  }


  private updateCircleColor(): void {
    const distance = this.mapService.calculateDistance(
      this.center.lat,
      this.center.lng,
      this.buildingPosition.lat,
      this.buildingPosition.lng
    );
    this.circleOptions = {
      ...this.circleOptions,
      fillColor: distance <= this.radius ? 'green' : 'red',
      strokeColor: distance <= this.radius ? '#006400' : '#8B0000',
    };
    this.positionChanged.emit(this.center);
  }

  startLocationTracking(): void {
    if ('geolocation' in navigator) {
      this.trackerId = navigator.geolocation.watchPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          // Actualizar el centro del mapa con las nuevas coordenadas
          this.center = {lat: latitude, lng: longitude};
          this.positionChanged.emit(this.center);
          this.updateCircleColor();
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('Permiso denegado para rastrear ubicación.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('Ubicación no disponible.');
              break;
            case error.TIMEOUT:
              console.error('Tiempo agotado para rastrear ubicación.');
              break;
            default:
              console.error('Ha ocurrido un error desconocido:', error);
          }
        },
        {enableHighAccuracy: true, maximumAge: 0, timeout: 10000}
      );
    } else {
      console.error('La API Geolocation no está soportada en este navegador.');
    }
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Update center coordinates to user's current location
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.updateCircleColor();
        },
        (error) => {
          // Handle errors
          console.error('Error retrieving location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
