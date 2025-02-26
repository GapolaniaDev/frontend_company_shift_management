import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedNgIconsModule } from "../../../shared/ng-icons.module";
import { NgIf } from "@angular/common";
import { ClockService } from "../../../services/clock/clock.service";
import { ShiftStateService } from '../../../services/shift-state/shift-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [SharedNgIconsModule, NgIf],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css'
})
export class ClockComponent implements OnInit, OnDestroy {
  isShiftActive = false;

  clockData: { hours: string; minutes: string; seconds: string; period?: string; currentDate?: string } = {
    hours: '00',
    minutes: '00',
    seconds: '00',
    period: '',
    currentDate: ''
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private clockService: ClockService,
    private shiftStateService: ShiftStateService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.shiftStateService.isShiftActive$.subscribe((isActive) => {
        console.log('isShiftActive', isActive);
        this.isShiftActive = isActive;
        this.clockService.startClock(isActive, null, (time) => {
          this.clockData = time;
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.clockService.stopClock();
  }
}
