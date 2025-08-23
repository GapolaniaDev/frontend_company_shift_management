import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-gantt-day-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gantt-day-header.component.html',
  styleUrl: './gantt-day-header.component.css'
})
export class GanttDayHeaderComponent {
  @Input() days: Date[] = [];

  getDayNumber(date: Date): string {
    return date.getDate().toString().padStart(2, '0');
  }

  getGridTemplateColumns(): string {
    return `repeat(${this.days.length}, 52px)`;
  }
}
