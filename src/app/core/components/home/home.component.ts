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
import {ConfirmationModalService} from "../../../services/confirmation-modal/confirmation-modal.service";

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
    ConfirmationModalComponent,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  isShiftActive = false;
  isThereShift = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private shiftState: ShiftStateService,
    private loaderService: LoaderService,
    private confirmationModal: ConfirmationModalService
  ) {
  }

  confirmAction(): void {
    this.confirmationModal.open(
      'Are you sure you want to perform this action?',
      () => {
        console.log('Action confirmed');
      },
      () => {
        console.log('Action cancelled');
      }
    );
  }


  ngOnInit(): void {
    this.subscriptions.push(
      this.shiftState.isShiftActive$.subscribe((isShiftActive) => (this.isShiftActive = isShiftActive)),
      this.shiftState.isThereShift$.subscribe((isThereShift) => (this.isThereShift = isThereShift))
    );

    this.refreshShifts();
  }

  refreshShifts(): void {
    this.shiftState.fetchShiftsToday(
      () => this.loaderService.show(),
      () => this.loaderService.hide()
    );
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
