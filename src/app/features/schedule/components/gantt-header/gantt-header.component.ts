import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttMonthHeaderComponent } from '../gantt-month-header/gantt-month-header.component';
import { GanttDayHeaderComponent } from '../gantt-day-header/gantt-day-header.component';

export type ViewMode = 'month' | 'week' | 'day';

@Component({
  selector: 'app-gantt-header',
  standalone: true,
  imports: [CommonModule, GanttMonthHeaderComponent, GanttDayHeaderComponent],
  templateUrl: './gantt-header.component.html',
  styleUrl: './gantt-header.component.css'
})
export class GanttHeaderComponent {
  @Input() currentDate: Date = new Date();
  @Input() viewMode: ViewMode = 'month';
  @Input() days: Date[] = [];

  getGridTemplateColumns(): string {
    return `250px repeat(${this.days.length}, 52px)`;
  }
}