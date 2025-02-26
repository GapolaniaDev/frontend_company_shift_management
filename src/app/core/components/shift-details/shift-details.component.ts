import {Component, OnDestroy} from '@angular/core';
import {DatePipe, NgClass} from "@angular/common";
import {ShiftStateService} from "../../../services/shift-state/shift-state.service";
import {Shift} from '../../../models/shift';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shift-details',
  standalone: true,
  imports: [
    DatePipe,
    NgClass
  ],
  templateUrl: './shift-details.component.html',
  styleUrl: './shift-details.component.css'
})
export class ShiftDetailsComponent implements OnDestroy {
  shifts: { success: boolean; shift: Shift | null } = {success: false, shift: null};
  isShiftActive: boolean = false;
  isInsideBuildingZone: boolean = false;

  private subscriptions: Subscription = new Subscription();

  constructor(private shiftStateService: ShiftStateService) {
    this.subscriptions.add(
      this.shiftStateService.shifts$.subscribe(shifts => (this.shifts = shifts))
    );

    this.subscriptions.add(
      this.shiftStateService.isShiftActive$.subscribe(isActive => (this.isShiftActive = isActive))
    );

    this.subscriptions.add(
      this.shiftStateService.isInsideBuildingZone$.subscribe(
        (isInside) => (this.isInsideBuildingZone = isInside)
      )
    );

  }

  toggleShift(): void {
    this.isShiftActive = !this.isShiftActive;
    console.log(this.isShiftActive, 'toggleShift');
    this.shiftStateService.setShiftActive(this.isShiftActive);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
