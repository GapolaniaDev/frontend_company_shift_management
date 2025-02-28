import {Component, OnDestroy, OnInit} from '@angular/core';
import {GoogleMap, MapCircle, MapMarker} from "@angular/google-maps";
import {NgIf} from "@angular/common";
import {MapService} from "../../../services/map/map.service";
import {Subscription} from 'rxjs';
import {ICON_CLOCK_ON, ICON_CLOCK_OFF, ICON_USER_LOCATION, BUILDING_ICON} from "../menu/constants/map.constants";
import {MapDataService} from "../../../services/map-data/map-data.service";
import {ShiftStateService} from "../../../services/shift-state/shift-state.service";

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
  center: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  zoom: number = 18;
  radius: number = 100;
  buildingPosition: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  clockOnPosition: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  clockOffPosition: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  options: google.maps.MapOptions = {};
  markerOptions: google.maps.MarkerOptions = {draggable: false};
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
    private mapService: MapService,
    private mapDataService: MapDataService,
    private shiftStateService: ShiftStateService
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.mapDataService.getMapData(this.radius).subscribe(({center, buildingPosition, isWithinZone}) => {
        this.center = center;
        this.buildingPosition = buildingPosition;
        this.updateCircleColor(isWithinZone);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  isPositionValid(position: google.maps.LatLngLiteral): boolean {
    return this.mapService.isPositionValid(position);
  }

  updateCircleColor(isWithinZone: boolean): void {
    this.circleOptions = {
      ...this.circleOptions,
      fillColor: isWithinZone ? 'green' : 'red',
      strokeColor: isWithinZone ? '#006400' : '#8B0000',
    };
  }
}
