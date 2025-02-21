import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {GoogleMap, MapCircle, MapMarker} from "@angular/google-maps";
import {DarkModeService} from "../../../services/dark-mode/dark-mode.service";

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [
    GoogleMap,
    MapMarker,
    MapCircle
  ],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'] // Fixed typo from `styleUrl` to `styleUrls`
})
export class MapsComponent implements OnChanges {

  // Input properties to receive map data from parent component
  @Input() center!: google.maps.LatLngLiteral; // Coordinates of the map center
  @Input() zoom!: number; // Zoom level
  @Input() radius!: number; // Radius for the circle
  @Input() key!: string;
  @ViewChild(GoogleMap) map!: GoogleMap;
  @Input() options!: google.maps.MapOptions;

  // Marker options
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

  constructor(private darkModeService: DarkModeService) {
  }

  ngOnInit() {
    this.getUserLocation();
    this.applyInitialDarkMode();
    this.darkModeService.isDarkMode$.subscribe((isDarkMode) => {
      this.updateMapStyles(isDarkMode);
    });
  }

  /**
   * Checks the initial dark mode state and applies corresponding styles.
   */
  private applyInitialDarkMode(): void {
    const isDarkMode = this.darkModeService.getDarkMode(); // Get the current state
    this.updateMapStyles(isDarkMode);
  }

  private updateMapStyles(isDarkMode: boolean): void {
    const darkMapStyles: google.maps.MapTypeStyle[] = [
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
    console.log('Dark mode:', isDarkMode);
    this.options = {
      ...this.options,
      styles: isDarkMode ? darkMapStyles : [],
    };
  }

  // Lifecycle hook triggered when component's input values change
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['center']) {
      console.log('Map center changed:', this.center);
      // If any additional map refresh logic is needed, handle it here
    }
  }

  /**
   * Updates the map center when the user moves the map
   * @param event Map mouse event to extract new center information
   */
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.center = event.latLng.toJSON(); // Update center coordinates
    }
  }

  /**
   * Retrieves the user's current location using Geolocation API
   */
  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Update center coordinates to user's current location
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
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
