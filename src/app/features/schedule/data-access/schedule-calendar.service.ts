import {Injectable} from '@angular/core'
import {BehaviorSubject, Observable, catchError, switchMap, tap, of} from 'rxjs'
import {Shift} from "@features/shifts/models/shift";
import {ShiftService} from "@core/services/shifts/shift.service";
import {HttpClient, HttpParams} from '@angular/common/http'
import {environment} from '../../../../environments/environment'
import LocationRestriction = google.maps.places.LocationRestriction;

export type CalendarViewType = 'month' | 'week' | 'day'

export interface Location {
  id: number;
  name: string;
}

export interface ShiftType {
  id: number;
  name: string;
}

export interface CalendarDay {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  shifts: Shift[];
}

export interface ShiftRangeResponse {
  success: boolean;
  data: Shift[];
  message?: string;
}

export interface ScheduleState {
  currentDate: Date;
  view: CalendarViewType;
  selectedLocation: Location | null;
  selectedShiftType: ShiftType | null;
  calendar: CalendarDay[];
  isLoading: boolean;
  error: string | null;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleCalendarService {
  private locations: Location[] = [
    {id: 1, name: 'All Locations'},
    {id: 2, name: 'Santos SA'},
    {id: 3, name: 'Banks SA'},
    {id: 4, name: 'Locklisth'},
    {id: 5, name: 'Giant Basebal'}
  ];

  private shiftTypes: ShiftType[] = [
    {id: 1, name: 'All ShiftType'},
    {id: 2, name: 'Night Shift'},
    {id: 3, name: 'Day Shift'},
    {id: 4, name: 'Afternoon Shift'},
  ];


  // Mock employees data
  private employees = [
    {
      id: 1,
      name: 'John Smith',
      photo: 'https://replicate.delivery/xezq/2Iy4nfF7Z8wf0kBxjSXaiiK9WMvGrFrRMax8o8Y0bdcUr9YUA/out-0.png',
      department: 'IT Department',
      shiftType: 'Full Time',
      location: 'New York'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      photo: 'https://replicate.delivery/xezq/7TGIC403YmYHBJDpZnfZaSgg5SFGMXbH5idbRiMe2GoUr9YUA/out-0.png',
      department: 'Customer Service',
      shiftType: 'Full Time',
      location: 'New York'
    },
    {
      id: 3,
      name: 'Mike Davis',
      photo: 'https://replicate.delivery/xezq/8kv9bKZxJg7DMhBBYI6j2AZh2TefkNUbFFoI20QsZD0Ur9YUA/out-0.png',
      department: 'Sales',
      shiftType: 'Full Time',
      location: 'New York'
    },
    {
      id: 4,
      name: 'Emily Wilson',
      photo: 'https://replicate.delivery/xezq/ewLaAwC8Fs1WGaGPCeJFfRsaf8y4NlokIbXWhSjWVU3Ut2jRB/out-0.png',
      department: 'Operations',
      shiftType: 'Full Time',
      location: 'New York'
    }
  ];

  // Mock shifts data
  private mockShifts: any[] = [
    {
      id: 1,
      date_start: '2025-08-01T06:00:00',
      date_end: '2025-08-01T14:00:00',
      employee_id: 1,
      shift_type_id: 1,
      state: 1,
      total_hours: '8',
      comments: null,
      weekday_code: 'fri',
      employee: {
        id: 1,
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@company.com',
        photo: 'https://replicate.delivery/xezq/2Iy4nfF7Z8wf0kBxjSXaiiK9WMvGrFrRMax8o8Y0bdcUr9YUA/out-0.png'
      },
      shift_type: {
        id: 1,
        name: 'Morning'
      }
    },
    {
      id: 2,
      date_start: '2025-08-01T14:00:00',
      date_end: '2025-08-01T22:00:00',
      employee_id: 2,
      shift_type_id: 2,
      state: 1,
      total_hours: '8',
      comments: null,
      weekday_code: 'fri',
      employee: {
        id: 2,
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@company.com',
        photo: 'https://replicate.delivery/xezq/7TGIC403YmYHBJDpZnfZaSgg5SFGMXbH5idbRiMe2GoUr9YUA/out-0.png'
      },
      shift_type: {
        id: 2,
        name: 'Afternoon'
      }
    },
    {
      id: 3,
      date_start: '2025-08-02T22:00:00',
      date_end: '2025-08-03T06:00:00',
      employee_id: 3,
      shift_type_id: 3,
      state: 1,
      total_hours: '8',
      comments: null,
      weekday_code: 'sat',
      employee: {
        id: 3,
        first_name: 'Mike',
        last_name: 'Davis',
        email: 'mike.davis@company.com',
        photo: 'https://replicate.delivery/xezq/8kv9bKZxJg7DMhBBYI6j2AZh2TefkNUbFFoI20QsZD0Ur9YUA/out-0.png'
      },
      shift_type: {
        id: 3,
        name: 'Night'
      }
    },
    {
      id: 4,
      date_start: '2025-08-05T06:00:00',
      date_end: '2025-08-05T14:00:00',
      employee_id: 1,
      shift_type_id: 1,
      state: 1,
      total_hours: '8',
      comments: null,
      weekday_code: 'tue',
      employee: {
        id: 1,
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@company.com',
        photo: 'https://replicate.delivery/xezq/2Iy4nfF7Z8wf0kBxjSXaiiK9WMvGrFrRMax8o8Y0bdcUr9YUA/out-0.png'
      },
      shift_type: {
        id: 1,
        name: 'Morning'
      }
    },
    {
      id: 5,
      date_start: '2025-08-05T14:00:00',
      date_end: '2025-08-05T22:00:00',
      employee_id: 4,
      shift_type_id: 2,
      state: 1,
      total_hours: '8',
      comments: null,
      weekday_code: 'tue',
      employee: {
        id: 4,
        first_name: 'Emily',
        last_name: 'Wilson',
        email: 'emily.wilson@company.com',
        photo: 'https://replicate.delivery/xezq/ewLaAwC8Fs1WGaGPCeJFfRsaf8y4NlokIbXWhSjWVU3Ut2jRB/out-0.png'
      },
      shift_type: {
        id: 2,
        name: 'Afternoon'
      }
    },
    {
      id: 6,
      date_start: '2025-08-07T06:00:00',
      date_end: '2025-08-07T14:00:00',
      employee_id: 2,
      shift_type_id: 1,
      state: 1,
      total_hours: '8',
      comments: null,
      weekday_code: 'thu',
      employee: {
        id: 2,
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@company.com',
        photo: 'https://replicate.delivery/xezq/7TGIC403YmYHBJDpZnfZaSgg5SFGMXbH5idbRiMe2GoUr9YUA/out-0.png'
      },
      shift_type: {
        id: 1,
        name: 'Morning'
      }
    },
    {
      id: 7,
      date_start: '2025-08-10T22:00:00',
      date_end: '2025-08-11T06:00:00',
      employee_id: 3,
      shift_type_id: 3,
      state: 1,
      total_hours: '8',
      comments: null,
      weekday_code: 'sun',
      employee: {
        id: 3,
        first_name: 'Mike',
        last_name: 'Davis',
        email: 'mike.davis@company.com',
        photo: 'https://replicate.delivery/xezq/8kv9bKZxJg7DMhBBYI6j2AZh2TefkNUbFFoI20QsZD0Ur9YUA/out-0.png'
      },
      shift_type: {
        id: 3,
        name: 'Night'
      }
    },
    {
      id: 8,
      date_start: '2025-08-12T06:00:00',
      date_end: '2025-08-12T14:00:00',
      employee_id: 4,
      shift_type_id: 1,
      state: 1,
      total_hours: '8',
      comments: null,
      weekday_code: 'tue',
      employee: {
        id: 4,
        first_name: 'Emily',
        last_name: 'Wilson',
        email: 'emily.wilson@company.com',
        photo: 'https://replicate.delivery/xezq/ewLaAwC8Fs1WGaGPCeJFfRsaf8y4NlokIbXWhSjWVU3Ut2jRB/out-0.png'
      },
      shift_type: {
        id: 1,
        name: 'Morning'
      }
    }
  ];

  private apiUrl = environment.apiUrl;

  // Format date to YYYY-MM-DD string
  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get first day of month
  private getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  // Get last day of month
  private getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  // Default state
  private initialState: ScheduleState = {
    currentDate: new Date(), // Current date
    view: 'month',
    selectedLocation: this.locations[0],
    selectedShiftType: this.shiftTypes[0],
    calendar: [],
    isLoading: false,
    error: null,
    startDate: this.formatDateToYYYYMMDD(this.getFirstDayOfMonth(new Date())),
    endDate: this.formatDateToYYYYMMDD(this.getLastDayOfMonth(new Date()))
  };

  private stateSubject = new BehaviorSubject<ScheduleState>(this.initialState);

  // Expose the state as an observable
  public state$ = this.stateSubject.asObservable();

  // Load shifts from API by date range
  loadShiftsByDateRange(): Observable<ShiftRangeResponse> {
    // Clear previous errors
    this.setError(null);

    // Set loading state
    this.setLoading(true);

    // Set a timeout to clear loading state in case of any unhandled errors
    setTimeout(() => {
      if (this.getCurrentState().isLoading) {
        this.setLoading(false);
      }
    }, 10000); // 10 seconds timeout

    const {startDate, endDate, view} = this.getCurrentState();
    const viewType = 'monthly'; // Always use monthly as backend doesnt do aggregation

    const params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate)
      .set('view_type', viewType);

    return this.http.get<ShiftRangeResponse>(`${this.apiUrl}/shifts/by-range`, {params})
      .pipe(
        tap(response => {
          if (response.success) {
            // Update shift data with API response
            this.mockShifts = response.data || []; // Ensure mockShifts is always an array
            this.generateCalendar();
          } else {
            this.setError(response.message || 'Failed to load shifts');
          }
          this.setLoading(false);
        }),
        catchError(error => {
          console.log('Error capturado en el catchError:', error);
          const errorMessage = error.error?.message || 'An error occurred while fetching shifts';
          this.setError(errorMessage);
          this.setLoading(false);

          // Return a new observable to prevent breaking the chain
          this.mockShifts = []; // Ensure mockShifts is an array even when an error occurs
          return of({
            success: false,
            data: [],
            message: errorMessage
          });
        })
      );
  }

  constructor(
    private shiftService: ShiftService,
    private http: HttpClient
  ) {
    // Initialize the calendar with empty data
    this.generateCalendar();

    // We'll initiate the API call from the component's ngOnInit
  }

  // Get current state
  getCurrentState(): ScheduleState {
    return this.stateSubject.getValue();
  }

  // Update state
  private updateState(newState: Partial<ScheduleState>): void {
    this.stateSubject.next({
      ...this.stateSubject.getValue(),
      ...newState
    });
  }

  // Set loading state
  setLoading(isLoading: boolean): void {
    this.updateState({isLoading});
  }

  // Set current view (month, week, day)
  setView(view: CalendarViewType): void {
    this.updateState({view});
    this.updateDateRange(); // This will trigger loading shifts and generating calendar
  }

  // Set selected location
  setLocation(location: Location): void {
    this.updateState({selectedLocation: location});
    // No need to reload data from API when changing department filter
    this.generateCalendar();
  }

  // Set selected ShiftType
  setShifttype(shiftType: ShiftType): void {
    this.updateState({selectedShiftType: shiftType});
    // No need to reload data from API when changing department filter
    this.generateCalendar();
  }

  // This method is now defined above the constructor to avoid initialization errors

  // Set error state
  setError(error: string | null): void {
    this.updateState({error});
  }

  // Update date range based on current view and date
  updateDateRange(): void {
    const {currentDate, view} = this.getCurrentState();
    let startDate: Date, endDate: Date;

    switch (view) {
      case 'month':
        startDate = this.getFirstDayOfMonth(currentDate);
        endDate = this.getLastDayOfMonth(currentDate);
        break;
      case 'week':
        startDate = this.getFirstDayOfWeek(currentDate);
        endDate = this.getLastDayOfWeek(currentDate);
        break;
      case 'day':
        startDate = new Date(currentDate);
        endDate = new Date(currentDate);
        break;
      default:
        startDate = this.getFirstDayOfMonth(currentDate);
        endDate = this.getLastDayOfMonth(currentDate);
    }

    this.updateState({
      startDate: this.formatDateToYYYYMMDD(startDate),
      endDate: this.formatDateToYYYYMMDD(endDate)
    });

    // Load shifts for the new date range and subscribe to the Observable
    this.loadShiftsByDateRange().subscribe({
      error: (err) => console.error('Error loading shifts:', err)
    });
  }

  // Navigate to previous period (month, week, or day)
  navigateToPrevious(): void {
    const {currentDate, view} = this.getCurrentState();
    const newDate = new Date(currentDate);

    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }

    this.updateState({currentDate: newDate});
    this.updateDateRange();
  }

  // Navigate to next period (month, week, or day)
  navigateToNext(): void {
    const {currentDate, view} = this.getCurrentState();
    const newDate = new Date(currentDate);

    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }

    this.updateState({currentDate: newDate});
    this.updateDateRange();
  }

  // Navigate to today
  navigateToToday(): void {
    this.updateState({currentDate: new Date()});
    this.updateDateRange();
  }

  // Get a list of locations
  getLocations(): Location[] {
    return [...this.locations];
  }

  // Get a list of locations
  getShiftType(): ShiftType[] {
    return [...this.shiftTypes];
  }

  // Get employee list for team section
  getEmployees(): any[] {
    const {selectedLocation, selectedShiftType} = this.getCurrentState();

    return this.employees.filter(e => {
      const matchLocation = !selectedLocation || selectedLocation.id === 1 || e.location === selectedLocation.name;
      const matchShiftType = !selectedShiftType || e.shiftType === selectedShiftType.name;
      return matchLocation && matchShiftType;
    });
  }

  // Generate the calendar days based on current view and date
  private generateCalendar(): void {
    const {currentDate, view, selectedLocation, selectedShiftType} = this.getCurrentState();
    let calendar: CalendarDay[] = [];

    switch (view) {
      case 'month':
        calendar = this.generateMonthCalendar(currentDate);
        break;
      case 'week':
        calendar = this.generateWeekCalendar(currentDate);
        break;
      case 'day':
        calendar = this.generateDayCalendar(currentDate);
        break;
    }

    // Filter shifts by selectedLocation and selectedShiftType if needed
    calendar = calendar.map(day => ({
      ...day,
      shifts: day.shifts.filter(shift => {
        // If the shift has an employee object, check its fields; otherwise keep the shift
        const emp: any = (shift as any).employee;

        let matches = true;

        if (selectedLocation && selectedLocation.id !== 1) {
          const locOk = emp && 'location' in emp ? emp.location === selectedLocation.name : true;
          matches = matches && locOk;
        }

        if (selectedShiftType && selectedShiftType.id !== 1) {
          const typeOk = emp && 'shiftType' in emp ? emp.shiftType === selectedShiftType.name : true;
          matches = matches && typeOk;
        }

        return matches;
      })
    }));

    this.updateState({calendar});
  }

  // Generate month calendar (5-6 rows of 7 days)
  private generateMonthCalendar(date: Date): CalendarDay[] {
    const calendar: CalendarDay[] = [];
    const today = new Date();

    // First day of the month
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    // Get day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();

    // Last day of previous month
    const lastDayPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

    // Fill in days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, lastDayPrevMonth - i);
      calendar.push({
        date: prevMonthDate,
        isToday: this.isSameDay(today, prevMonthDate),
        isCurrentMonth: false,
        shifts: this.getShiftsForDate(prevMonthDate)
      });
    }

    // Number of days in current month
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // Fill in days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
      calendar.push({
        date: currentDate,
        isToday: this.isSameDay(today, currentDate),
        isCurrentMonth: true,
        shifts: this.getShiftsForDate(currentDate)
      });
    }

    // Fill in days from next month to complete the grid (up to 42 days total - 6 rows)
    const remainingDays = 42 - calendar.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, i);
      calendar.push({
        date: nextMonthDate,
        isToday: this.isSameDay(today, nextMonthDate),
        isCurrentMonth: false,
        shifts: this.getShiftsForDate(nextMonthDate)
      });
    }

    return calendar;
  }

  // Generate week calendar (7 days)
  private generateWeekCalendar(date: Date): CalendarDay[] {
    const calendar: CalendarDay[] = [];
    const today = new Date();

    // Find the first day of the week (Sunday)
    const firstDayOfWeek = new Date(date);
    const day = date.getDay();
    firstDayOfWeek.setDate(date.getDate() - day);

    // Generate 7 days starting from Sunday
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(firstDayOfWeek);
      currentDate.setDate(firstDayOfWeek.getDate() + i);

      calendar.push({
        date: currentDate,
        isToday: this.isSameDay(today, currentDate),
        isCurrentMonth: currentDate.getMonth() === date.getMonth(),
        shifts: this.getShiftsForDate(currentDate)
      });
    }

    return calendar;
  }

  // Generate day calendar (single day)
  private generateDayCalendar(date: Date): CalendarDay[] {
    const today = new Date();
    const calendar: CalendarDay[] = [{
      date: date,
      isToday: this.isSameDay(today, date),
      isCurrentMonth: true, // Always current month in day view
      shifts: this.getShiftsForDate(date)
    }];

    return calendar;
  }

  // Get shifts for a specific date
  private getShiftsForDate(date: Date): Shift[] {
    // In a real app, this would query the API
    if (!this.mockShifts || !Array.isArray(this.mockShifts)) {
      return []; // Return empty array if mockShifts is undefined, null, or not an array
    }

    return this.mockShifts.filter(shift => {
      const shiftDate = new Date((shift.date_start) ? shift.date_start : '');
      return this.isSameDay(date, shiftDate);
    });
  }

  // Check if two dates are the same day
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // Format date for display: Month YYYY
  formatMonthYear(date: Date): string {
    return date.toLocaleString('default', {month: 'long', year: 'numeric'});
  }

  // Get time string from date
  formatShiftTime(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // These methods are now defined at the top of the class to avoid initialization errors

  // Get first day of week
  getFirstDayOfWeek(date: Date): Date {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ...
    const diff = date.getDate() - day;
    return new Date(date.getFullYear(), date.getMonth(), diff);
  }

  // Get last day of week
  getLastDayOfWeek(date: Date): Date {
    const firstDay = this.getFirstDayOfWeek(date);
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    return lastDay;
  }

  // Add a new shift
  addShift(shift: Partial<Shift>): Observable<any> {
    this.setLoading(true);

    // Check that required fields are present
    if (!shift.employee_id || !shift.shift_type_id || !shift.date_start || !shift.date_end) {
      this.setError('Missing required shift data');
      this.setLoading(false);
      return of({success: false, message: 'Missing required shift data'});
    }

    // Create a proper shift data object to send to the API
    const shiftData: any = {
      employee_id: shift.employee_id,
      shift_type_id: shift.shift_type_id,
      date_start: shift.date_start,
      date_end: shift.date_end
    };

    // Add optional fields if present
    if (shift.comments) shiftData.comments = shift.comments;

    // In a real app, we'd call the API to create the shift
    return this.shiftService.createShift(shiftData as any).pipe(
      tap(response => {
        // After successful creation, reload shifts to refresh the calendar
        this.loadShiftsByDateRange().subscribe({
          error: (err) => console.error('Error reloading shifts after adding:', err)
        });
      }),
      catchError(error => {
        const errorMessage = error.error?.message || 'An error occurred while creating the shift';
        this.setError(errorMessage);
        this.setLoading(false);
        return of({success: false, message: errorMessage});
      }),
      tap(() => this.setLoading(false))
    );
  }

  // Select a day
  selectDay(date: Date): void {
    this.updateState({currentDate: date});

    if (this.getCurrentState().view !== 'day') {
      this.setView('day'); // This will trigger updateDateRange
    } else {
      this.updateDateRange();
    }
  }
}
