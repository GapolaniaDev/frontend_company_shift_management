import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GanttDayHeaderComponent} from '@features/schedule/components/gantt-day-header/gantt-day-header.component';
import {ViewMode} from '@features/schedule/components/shared-types';

@Component({
  selector: 'app-gantt-header',
  standalone: true,
  imports: [CommonModule, GanttDayHeaderComponent],
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
