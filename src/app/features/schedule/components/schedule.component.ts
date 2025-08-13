import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ScheduleCalendarService, CalendarViewType, Department } from '@features/schedule/data-access/schedule-calendar.service';
import { SharedNgIconsModule } from '@shared/ng-icons.module';
import { ShiftFormComponent } from '@features/schedule/components/shift-form/shift-form.component';
import { Shift } from "@features/shifts/models/shift";

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SharedNgIconsModule,
    ShiftFormComponent
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {
  // Track shift types for legend
  shiftTypes = [
    { name: 'Morning Shift (6AM-12PM)', color: '#F97316' },
    { name: 'Afternoon Shift (12PM-6PM)', color: '#3B82F6' },
    { name: 'Night Shift (6PM-6AM)', color: '#4F46E5' },
    { name: 'Day Off', color: '#9CA3AF' }
  ];

  // Days of week
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // State for shift form
  showShiftForm = false;
  selectedShift: Partial<Shift> | null = null;
  selectedDate: Date | null = null;

  constructor(public calendarService: ScheduleCalendarService) {}

  ngOnInit(): void {
    // Initialize calendar and load data from API
    this.calendarService.navigateToToday();

    // Subscribe to the API call so it actually happens
    this.calendarService.loadShiftsByDateRange().subscribe({
      error: (err) => {
        console.error('Error loading shifts:', err);
        this.showErrorModal('Failed to load shifts. Please try again later.');
      }
    });
  }

  // Change view (month, week, day)
  changeView(view: CalendarViewType): void {
    this.calendarService.setView(view);
  }

  // Change department
  changeDepartment(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const departmentId = parseInt(selectElement.value, 10);
    const department = this.calendarService.getDepartments().find(d => d.id === departmentId);

    if (department) {
      this.calendarService.setDepartment(department);
    }
  }

  // Get CSS class for shift based on shift type
  getShiftClass(shiftTypeId: number | null | undefined): string | string[] | Set<string> | {[klass: string]: any} {
    if (shiftTypeId == null) {
      return 'bg-gray-200 text-gray-600';
    }

    switch (shiftTypeId) {
      case 1: return 'shift-morning';
      case 2: return 'shift-afternoon';
      case 3: return 'shift-night';
      default: return ''
    }
  }

  // Select a day
  selectDay(day: any): void {
    if (day.isCurrentMonth) {
      if (this.calendarService.getCurrentState().view === 'month') {
        // In month view, clicking a day shows the day view
        this.calendarService.selectDay(day.date);
      } else {
        // In other views, clicking a day opens the shift form
        this.openShiftForm(null, day.date);
      }
    }
  }

  // Open shift form to add or edit a shift
  openShiftForm(shift: Partial<Shift> | null = null, date: Date | null = null): void {
    this.selectedShift = shift;
    this.selectedDate = date || this.calendarService.getCurrentState().currentDate;
    this.showShiftForm = true;
  }

  // Close shift form
  closeShiftForm(): void {
    this.showShiftForm = false;
    this.selectedShift = null;
    this.selectedDate = null;
  }

  // Save shift (add or update)
  saveShift(shift: Partial<Shift>): void {
    this.calendarService.addShift(shift).subscribe({
      next: (response) => {
        if (response && response.success === false) {
          // Show error modal if there's an API error
          this.showErrorModal(response.message || 'Failed to save shift');
        } else {
          this.closeShiftForm();
        }
      },
      error: (err) => {
        this.showErrorModal(err.error?.message || 'An error occurred while saving the shift');
      }
    });
  }

  // Show error modal with message
  showErrorModal(message: string): void {
    // In a real app, we'd show a modal here
    // For now, we'll just use an alert
    alert(`Error: ${message}`);
  }

  // Format time for display
  formatTime(dateStr: string | null): string {
    if (!dateStr) return '';
    return this.calendarService.formatShiftTime(dateStr);
  }

  // Get calendar grid based on current view
  getCalendarGridClass(): string {
    const { view } = this.calendarService.getCurrentState();
    switch (view) {
      case 'month': return 'grid-cols-7 grid-rows-5';
      case 'week': return 'grid-cols-7 grid-rows-1';
      case 'day': return 'grid-cols-1 grid-rows-1';
      default: return 'grid-cols-7 grid-rows-5';
    }
  }

  // Add new shift via form
  addShift(): void {
    this.openShiftForm(null, this.calendarService.getCurrentState().currentDate);
  }
}
