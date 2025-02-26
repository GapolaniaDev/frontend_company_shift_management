import {Component, Input} from '@angular/core';
import {SharedNgIconsModule} from "../../../../shared/ng-icons.module";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [SharedNgIconsModule, NgIf],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css'
})
export class ClockComponent {
  @Input() clockHours!: string;
  @Input() clockMinutes!: string;
  @Input() clockSeconds!: string;
  @Input() period!: string;
  @Input() currentDate!: string;
  @Input() isShiftActive!: boolean;
}
