import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gantt-month-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gantt-month-header.component.html',
  styleUrl: './gantt-month-header.component.css'
})
export class GanttMonthHeaderComponent {
  @Input() currentDate: Date = new Date();
  @Input() daysCount: number = 31;

  getMonthYearText(): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    };
    return this.currentDate.toLocaleDateString('en-US', options);
  }
}