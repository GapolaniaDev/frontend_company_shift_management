import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {Shift} from '../../../models/shift';

@Component({
  selector: 'app-shift-completed',
  standalone: true,
  imports: [],
  templateUrl: './shift-completed.component.html',
  styleUrl: './shift-completed.component.css'
})
export class ShiftCompletedComponent implements OnInit {
  @Input() completedShift: Shift | null = null;
  @Output() close = new EventEmitter<void>();

  // Calculated and formatted fields
  formattedStartDateTime: string = '';
  formattedEndDateTime: string = '';
  totalHours: string = '';

  ngOnInit(): void {
    if (this.completedShift) {
      this.calculateShiftDetails();
    }
  }

  /**
   * Calculate and format shift details
   */
  private calculateShiftDetails(): void {
    if (!this.completedShift) return;

    // Obtain the start and end times (local or server times as fallback)
    const start = this.completedShift.local_clock_on_time || this.completedShift.clock_on_time;
    const end = this.completedShift.local_clock_off_time || this.completedShift.clock_off_time;

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      // Format start and end times as "Sunday 16 March 00:30"
      this.formattedStartDateTime = this.formatDateTime(startDate);
      this.formattedEndDateTime = this.formatDateTime(endDate);

      // Calculate total hours worked
      const diffMs = endDate.getTime() - startDate.getTime(); // Difference in milliseconds
      const diffHours = diffMs / (1000 * 60 * 60); // Convert to hours
      this.totalHours = diffHours.toFixed(2); // Format to two decimal places
    } else {
      this.totalHours = '0'; // Default to 0 hours if start or end times are missing
    }
  }

  /**
   * Format a Date object as "Sunday 16 March 00:30"
   */
  private formatDateTime(date: Date): string {
    // Extract day, date and time
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-hour format
    };
    return date.toLocaleDateString('en-US', options); // Format the date in English
  }

}
