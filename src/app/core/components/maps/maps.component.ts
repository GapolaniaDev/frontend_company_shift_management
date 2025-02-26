import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleMap, MapCircle, MapMarker } from "@angular/google-maps";
import { NgIf } from "@angular/common";
import { MapService } from "../../../services/map/map.service";
import { ShiftStateService } from "../../../services/shift-state/shift-state.service";
import { Subscription } from 'rxjs';
import { ICON_CLOCK_ON, ICON_CLOCK_OFF, ICON_USER_LOCATION, BUILDING_ICON } from "../menu/constants/map.constants";

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
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom: number = 15; // Default zoom level
  radius: number = 100; // Default radius in meters
  buildingPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  clockOnPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  clockOffPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  options: google.maps.MapOptions = {};
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  circleOptions: google.maps.CircleOptions = {
    fillColor: 'green',
    fillOpacity: 0.5,
    strokeColor: '#006400',
    strokeOpacity: 1.0,
    strokeWeight: 2,
    clickable: false,
    editable: false,
    zIndex: 1
  };

  protected readonly ICON_CLOCK_ON = ICON_CLOCK_ON;
  protected readonly ICON_CLOCK_OFF = ICON_CLOCK_OFF;
  protected readonly ICON_USER_LOCATION = ICON_USER_LOCATION;
  protected readonly BUILDING_ICON = BUILDING_ICON;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private shiftStateService: ShiftStateService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    // Subscripciones al servicio ShiftStateService
    this.subscriptions.add(
      this.shiftStateService.buildingPosition$.subscribe(position => {
        this.buildingPosition = position;
      })
    );

    this.subscriptions.add(
      this.shiftStateService.clockOnPosition$.subscribe(position => {
        this.clockOnPosition = position;
      })
    );

    this.subscriptions.add(
      this.shiftStateService.clockOffPosition$.subscribe(position => {
        this.clockOffPosition = position;
      })
    );

    this.getUserLocation();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUserLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        this.center = { lat: latitude, lng: longitude };
        this.updateCircleColor();
      });
    }
  }

  isPositionValid(position: google.maps.LatLngLiteral): boolean {
    return this.mapService.isPositionValid(position);
  }

  updateCircleColor(): void {
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
  }
}
