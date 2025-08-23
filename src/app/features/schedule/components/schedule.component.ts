import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ScheduleCalendarService, CalendarViewType } from '@features/schedule/data-access/schedule-calendar.service';
import { SharedNgIconsModule } from '@shared/ng-icons.module';
import { ShiftFormComponent } from '@features/schedule/components/shift-form/shift-form.component';
import { Shift } from "@features/shifts/models/shift";
import { GanttContainerComponent } from './gantt-container/gantt-container.component';
import { Employee, Shift as GanttShift, ViewMode } from './shared-types';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SharedNgIconsModule,
    ShiftFormComponent,
    GanttContainerComponent
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {
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

  showErrorModal(message: string): void {
    // In a real app, we'd show a modal here
    // For now, we'll just use an alert
    alert(`Error: ${message}`);
  }

  addShift(): void {
    this.openShiftForm(null, this.calendarService.getCurrentState().currentDate);
  }
  getAllShiftsForPeriod(): Shift[] {
    const calendar = this.calendarService.getCurrentState().calendar;
    const allShifts: Shift[] = [];

    calendar.forEach(day => {
      allShifts.push(...day.shifts);
    });

    return allShifts;
  }

  protected readonly location = location;

  // Transform data for Gantt components
  getGanttEmployeesData(): Employee[] {
    // Use mock data for demonstration
    return this.getMockEmployeesData();
  }

  // Mock data for demonstration
  private getMockEmployeesData(): Employee[] {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const employees: Employee[] = [
      {
        id: '1',
        name: 'John Smith',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        shifts: {}
      },
      {
        id: '2',
        name: 'Maria Garcia',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face',
        shifts: {}
      },
      {
        id: '3',
        name: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        shifts: {}
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        shifts: {}
      },
      {
        id: '5',
        name: 'David Brown',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        shifts: {}
      },
      {
        id: '6',
        name: 'Lisa Anderson',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        shifts: {}
      },
      {
        id: '7',
        name: 'Robert Miller',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
        shifts: {}
      },
      {
        id: '8',
        name: 'Jennifer Davis',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
        shifts: {}
      },
      {
        id: '9',
        name: 'Chris Taylor',
        avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face',
        shifts: {}
      },
      {
        id: '10',
        name: 'Amanda White',
        avatar: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=100&h=100&fit=crop&crop=face',
        shifts: {}
      }
    ];

    // Generate random shifts for each employee
    employees.forEach((employee) => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        if (Math.random() > 0.3) {
          const shiftsForDay: GanttShift[] = [];

          // Random number of shifts (1-3)
          const numShifts = Math.floor(Math.random() * 3) + 1;

          for (let i = 0; i < numShifts; i++) {
            const shiftTypes: Array<'morning' | 'afternoon' | 'night'> = ['morning', 'afternoon', 'night'];
            const shiftType = shiftTypes[Math.floor(Math.random() * shiftTypes.length)];

            let startTime: string, endTime: string, code: string;

            switch (shiftType) {
              case 'morning':
                startTime = '06:00';
                endTime = '14:00';
                code = Math.random() > 0.5 ? 'M' : 'AM';
                break;
              case 'afternoon':
                startTime = '14:00';
                endTime = '22:00';
                code = Math.random() > 0.5 ? 'A' : 'PM';
                break;
              case 'night':
                startTime = '22:00';
                endTime = '06:00';
                code = Math.random() > 0.5 ? 'N' : 'NT';
                break;
            }

            shiftsForDay.push({
              id: `${employee.id}-${day}-${i}`,
              type: shiftType,
              startTime,
              endTime,
              code,
              location: Math.random() > 0.5 ? 'HQ' : 'Branch'
            });
          }

          employee.shifts[dateKey] = shiftsForDay;
        }
      }
    });

    return employees;
  }

  // Mock locations data
  getMockLocations(): any[] {
    return [
      { id: '1', name: 'Headquarters' },
      { id: '2', name: 'Downtown Branch' },
      { id: '3', name: 'North Branch' },
      { id: '4', name: 'South Branch' },
      { id: '5', name: 'Remote Work' }
    ];
  }

  // Mock shift types data
  getMockShiftTypes(): any[] {
    return [
      { id: '1', name: 'Morning Shift' },
      { id: '2', name: 'Afternoon Shift' },
      { id: '3', name: 'Night Shift' },
      { id: '4', name: 'Full Day' },
      { id: '5', name: 'Part Time' }
    ];
  }

  getCurrentViewMode(): ViewMode {
    const view = this.calendarService.getCurrentState().view;
    return view as ViewMode;
  }

  getCurrentDate(): Date {
    return this.calendarService.getCurrentState().currentDate;
  }

  getIsLoading(): boolean {
    return this.calendarService.getCurrentState().isLoading;
  }

  getError(): string | null {
    return this.calendarService.getCurrentState().error;
  }

  // Event handlers for Gantt components
  onGanttShiftClick(event: { shift: GanttShift; employee: Employee; date: string }): void {
    // Find the original shift and open the form
    const originalShift = this.findOriginalShift(event.shift.id);
    if (originalShift) {
      this.openShiftForm(originalShift, new Date(event.date));
    }
  }

  onGanttCellClick(event: { employee: Employee; date: string }): void {
    // Open shift form to add new shift for this employee and date
    this.openShiftForm(null, new Date(event.date));
  }

  onGanttAddShift(): void {
    this.addShift();
  }

  private findOriginalShift(shiftId: string): Shift | null {
    const allShifts = this.getAllShiftsForPeriod();
    return allShifts.find(shift => shift.id?.toString() === shiftId) || null;
  }

  // Location and ShiftType change handlers for Gantt
  onLocationChangeFromGantt(locationId: string): void {
    const location = this.calendarService.getLocations().find(d => d.id === parseInt(locationId, 10));
    if (location) {
      this.calendarService.setLocation(location);
    }
  }

  onShiftTypeChangeFromGantt(shiftTypeId: string): void {
    const shiftType = this.calendarService.getShiftType().find(d => d.id === parseInt(shiftTypeId, 10));
    if (shiftType) {
      this.calendarService.setLocation(shiftType); // This might need to be setShiftType if available
    }
  }
}
