import { Component, OnDestroy } from '@angular/core';
import { DatePipe, NgClass, NgIf } from "@angular/common";
import { ShiftStateService } from "../../../services/shift-state/shift-state.service";
import { Shift } from '../../../models/shift';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shift-details',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    NgClass
  ],
  templateUrl: './shift-details.component.html',
  styleUrl: './shift-details.component.css'
})
export class ShiftDetailsComponent implements OnDestroy {
  shifts: { success: boolean; shift: Shift | null } = { success: false, shift: null };
  isShiftActive: boolean = false;
  isInsideBuildingZone: boolean = false;

  private subscriptions: Subscription = new Subscription();

  constructor(private shiftStateService: ShiftStateService) {
    // Cargar estado inicial desde el servicio
    this.subscriptions.add(
      this.shiftStateService.shifts$.subscribe(shifts => (this.shifts = shifts))
    );

    this.subscriptions.add(
      this.shiftStateService.isShiftActive$.subscribe(isActive => (this.isShiftActive = isActive))
    );
  }

  toggleShift(): void {
    this.isShiftActive = !this.isShiftActive;
    this.shiftStateService.setShiftActive(this.isShiftActive); // Actualizamos el servicio
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
