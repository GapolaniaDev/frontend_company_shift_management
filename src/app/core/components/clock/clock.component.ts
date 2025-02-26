import {Component, Input} from '@angular/core';
import {SharedNgIconsModule} from "../../../shared/ng-icons.module";
import {NgIf} from "@angular/common";
import {ClockService} from "../../../services/clock/clock.service";

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [SharedNgIconsModule, NgIf],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css'
})
export class ClockComponent {
  @Input() isShiftActive!: boolean;

  clockData: { hours: string; minutes: string; seconds: string; period?: string; currentDate?: string } = {
    hours: '00',
    minutes: '00',
    seconds: '00',
    period: '',
    currentDate: ''
  };

  constructor(private clockService: ClockService) {
  }

  ngOnInit() {
    this.clockService.startClock(this.isShiftActive, null, (time) => {
      this.clockData = time;
    });
  }

  ngOnDestroy() {
    this.clockService.stopClock();
  }

}
