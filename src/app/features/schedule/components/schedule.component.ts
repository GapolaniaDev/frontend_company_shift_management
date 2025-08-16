import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ScheduleCalendarService, CalendarViewType } from '@features/schedule/data-access/schedule-calendar.service';
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

  // Change location
  changeLocation(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const locationId = parseInt(selectElement.value, 10);
    const location = this.calendarService.getLocations().find(d => d.id === locationId);

    if (location) {
      this.calendarService.setLocation(location);
    }
  }

  // Change shiftType
  changeShiftType(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const shiftTypeId = parseInt(selectElement.value, 10);
    const shiftType = this.calendarService.getShiftType().find(d => d.id === shiftTypeId);

    if (shiftType) {
      this.calendarService.setLocation(shiftType);
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

  // Gantt Chart Methods
  getGanttDates(): Date[] {
    const { view, currentDate, startDate, endDate } = this.calendarService.getCurrentState();
    const dates: Date[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Generate dates based on current view
    switch (view) {
      case 'month':
        // Show all days of the month
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
        break;
      case 'week':
        // Show 7 days of the week
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
        break;
      case 'day':
        // Show only the current day
        dates.push(new Date(currentDate));
        break;
      default:
        // Default to month view
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
    }
    
    return dates;
  }

  getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  getGanttEmployees(): any[] {
    // Get unique employees from all shifts in the current period
    const shifts = this.getAllShiftsForPeriod();
    const employeeMap = new Map();
    
    shifts.forEach(shift => {
      if (shift.employee && shift.employee.id) {
        employeeMap.set(shift.employee.id, shift.employee);
      }
    });
    
    return Array.from(employeeMap.values()).sort((a, b) => {
      const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim();
      const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim();
      return nameA.localeCompare(nameB);
    });
  }

  getAllShiftsForPeriod(): Shift[] {
    const calendar = this.calendarService.getCurrentState().calendar;
    const allShifts: Shift[] = [];
    
    calendar.forEach(day => {
      allShifts.push(...day.shifts);
    });
    
    return allShifts;
  }

  getEmployeeShiftsForPeriod(employeeId: number): Shift[] {
    return this.getAllShiftsForPeriod().filter(shift => 
      shift.employee && shift.employee.id === employeeId
    );
  }

  // Helper method to create Date objects in template
  createDateFromString(dateString: string | null): Date {
    return new Date(dateString || new Date());
  }

  // Get shifts for a specific employee on a specific day
  getEmployeeShiftsForDay(employeeId: number, day: Date): Shift[] {
    return this.getAllShiftsForPeriod().filter(shift => {
      if (!shift.employee || shift.employee.id !== employeeId) return false;
      if (!shift.date_start) return false;
      
      const shiftDate = new Date(shift.date_start);
      return this.isSameDay(day, shiftDate);
    });
  }

  // Helper method to check if two dates are the same day
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  // Format time in short format (HH:mm)
  formatTimeShort(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  protected readonly location = location;
}
