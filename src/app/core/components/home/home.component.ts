import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShiftStateService} from '../../../services/shift-state/shift-state.service';
import {LoaderService} from '../../../services/loader/loader.service';
import {Subscription} from 'rxjs';
import {CommonModule, NgIf} from "@angular/common";
import {MapsComponent} from "../maps/maps.component";
import {ClockComponent} from "../clock/clock.component";
import {ShiftDetailsComponent} from "../shift-details/shift-details.component";
import {NoShiftDetailsComponent} from "../no-shift-details/no-shift-details.component";
import {SharedNgIconsModule} from "../../../shared/ng-icons.module";
import {ConfirmationModalComponent} from "../confirmation-modal/confirmation-modal.component";
import {GeolocationService} from "../../../services/geolocation/geolocation.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    MapsComponent,
    ClockComponent,
    ShiftDetailsComponent,
    NoShiftDetailsComponent,
    SharedNgIconsModule,
    ConfirmationModalComponent

  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  isShiftActive = false;
  isThereShift = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private shiftStateService: ShiftStateService,
    private loaderService: LoaderService,
    private geolocationService:GeolocationService,
  ) {
  }


  ngOnInit(): void {
    this.subscriptions.push(
      this.shiftStateService.isShiftActive$.subscribe((isShiftActive) => (this.isShiftActive = isShiftActive)),
      this.shiftStateService.isThereShift$.subscribe((isThereShift) => (this.isThereShift = isThereShift))
    );
    this.refreshShifts();
  }

  refreshShifts(): void {
    this.shiftStateService.fetchShiftsToday(
      () => this.loaderService.show(),
      () => this.loaderService.hide()
    );
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
