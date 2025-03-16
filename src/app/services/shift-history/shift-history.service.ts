import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ShiftHistoryResponse, ShiftHistoryState } from '../../models/shift-history.model';
import { DateSummary } from '../../models/shift-history.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftHistoryService {
  private apiUrl = environment.apiUrl;
  
  // Initial state
  private initialState: ShiftHistoryState = {
    loading: false,
    selectedDate: this.formatDateToYYYYMMDD(new Date()),
    currentShift: null,
    shiftHistory: null,
    dateSummary: null,
    error: null
  };
  
  // BehaviorSubject to store the state
  private stateSubject = new BehaviorSubject<ShiftHistoryState>(this.initialState);
  
  // Observable to expose the state
  public state$ = this.stateSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  
  /**
   * Get the current state
   */
  getCurrentState(): ShiftHistoryState {
    return this.stateSubject.getValue();
  }
  
  /**
   * Update loading state
   */
  setLoading(loading: boolean): void {
    this.stateSubject.next({
      ...this.stateSubject.getValue(),
      loading
    });
  }
  
  /**
   * Set error message
   */
  setError(error: string | null): void {
    this.stateSubject.next({
      ...this.stateSubject.getValue(),
      error
    });
  }
  
  /**
   * Load shift history data for a given date
   * @param date Date in YYYY-MM-DD format
   */
  loadShiftHistory(date: string): Observable<ShiftHistoryResponse> {
    // Set loading state
    this.setLoading(true);
    this.setError(null);
    
    // Update selected date in state
    this.stateSubject.next({
      ...this.stateSubject.getValue(),
      selectedDate: date
    });
    
    // Build the query parameters
    const params = new HttpParams().set('date', date);
    
    // Make the HTTP request
    return this.http.get<ShiftHistoryResponse>(`${this.apiUrl}/shifts/shift-history`, { params })
      .pipe(
        tap(response => {
          if (response.success) {
            // Update state with response data
            this.stateSubject.next({
              ...this.stateSubject.getValue(),
              currentShift: response.data.current_shift,
              shiftHistory: response.data.shift_history,
              dateSummary: response.data.date_summary,
              loading: false,
              error: null
            });
          } else {
            // Handle unsuccessful response
            this.setError('Request failed');
            this.setLoading(false);
          }
        }),
        catchError(error => {
          // Handle error
          const errorMessage = error.error?.message || 'An error occurred while fetching shift history';
          this.setError(errorMessage);
          this.setLoading(false);
          
          // Re-throw the error to be handled by the component
          throw error;
        })
      );
  }
  
  /**
   * Generate date summary for 7 days (3 before, current, 3 after)
   * This is used when the backend doesn't provide date_summary
   * @param centerDate The date to center around
   */
  generateDateSummary(centerDate: Date): DateSummary[] {
    const dateSummary: DateSummary[] = [];
    
    // Start 3 days before
    const startDate = new Date(centerDate);
    startDate.setDate(centerDate.getDate() - 3);
    
    // Generate 7 days (3 before, current, 3 after)
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      dateSummary.push({
        date: this.formatDateToYYYYMMDD(date),
        total_shifts: 0 // No information about shifts
      });
    }
    
    return dateSummary;
  }
  
  /**
   * Format a date to YYYY-MM-DD
   */
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Get a date from a YYYY-MM-DD string
   */
  getDateFromYYYYMMDD(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  /**
   * Navigate to the next day
   */
  navigateToNextDay(): Observable<ShiftHistoryResponse> {
    const currentState = this.getCurrentState();
    const currentDate = this.getDateFromYYYYMMDD(currentState.selectedDate);
    
    // One month into the future limit check
    const today = new Date();
    const futureLimit = new Date(today);
    futureLimit.setMonth(today.getMonth() + 1);
    
    if (currentDate >= futureLimit) {
      // Already at future limit, don't navigate
      return of({ success: false, data: { current_shift: null, shift_history: null, date_summary: null } });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
    const nextDate = this.formatDateToYYYYMMDD(currentDate);
    
    return this.loadShiftHistory(nextDate);
  }
  
  /**
   * Navigate to the previous day
   */
  navigateToPreviousDay(): Observable<ShiftHistoryResponse> {
    const currentState = this.getCurrentState();
    const currentDate = this.getDateFromYYYYMMDD(currentState.selectedDate);
    
    // One year into the past limit check
    const today = new Date();
    const pastLimit = new Date(today);
    pastLimit.setFullYear(today.getFullYear() - 1);
    
    if (currentDate <= pastLimit) {
      // Already at past limit, don't navigate
      return of({ success: false, data: { current_shift: null, shift_history: null, date_summary: null } });
    }
    
    // Move to previous day
    currentDate.setDate(currentDate.getDate() - 1);
    const prevDate = this.formatDateToYYYYMMDD(currentDate);
    
    return this.loadShiftHistory(prevDate);
  }
  
  /**
   * Check if a date is at the future limit (1 month ahead)
   */
  isAtFutureLimit(date: string): boolean {
    const dateObj = this.getDateFromYYYYMMDD(date);
    const today = new Date();
    const futureLimit = new Date(today);
    futureLimit.setMonth(today.getMonth() + 1);
    
    return dateObj >= futureLimit;
  }
  
  /**
   * Check if a date is at the past limit (1 year back)
   */
  isAtPastLimit(date: string): boolean {
    const dateObj = this.getDateFromYYYYMMDD(date);
    const today = new Date();
    const pastLimit = new Date(today);
    pastLimit.setFullYear(today.getFullYear() - 1);
    
    return dateObj <= pastLimit;
  }
  
  /**
   * Update the state with generated date summary if needed
   */
  updateDateSummaryIfNeeded(): void {
    const currentState = this.getCurrentState();
    
    // If date_summary is null, generate it
    if (!currentState.dateSummary) {
      const selectedDate = this.getDateFromYYYYMMDD(currentState.selectedDate);
      const generatedDateSummary = this.generateDateSummary(selectedDate);
      
      this.stateSubject.next({
        ...currentState,
        dateSummary: generatedDateSummary
      });
    }
  }
}