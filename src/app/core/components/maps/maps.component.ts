import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {GoogleMap, MapCircle, MapMarker} from "@angular/google-maps";

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

  // Lifecycle hook triggered when component's input values change
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['center']) {
      console.log('Map center changed:', this.center);
      // If any additional map refresh logic is needed, handle it here
    }
  }

  // Lifecycle hook triggered when component initializes
  ngOnInit() {
    this.getUserLocation();
  }

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
