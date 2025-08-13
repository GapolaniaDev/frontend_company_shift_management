import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {SharedNgIconsModule} from "@shared/ng-icons.module";
import {LoaderService} from "@core/services/loader.service";
import {ShiftHistoryService} from "@features/shifts/data-access/shift-history/shift-history.service";
import {DateSummary} from "@features/shifts/models/shift-history.model";
import {Shift, ShiftState} from "@features/shifts/models/shift";
import {Subject, takeUntil} from 'rxjs'

interface DayInfo {
  date: string;
  dayName: string;
  dayNumber: number;
  hasShift: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-shift-history',
  standalone: true,
  imports: [
    CommonModule,
    SharedNgIconsModule,
    DatePipe,
  ],
  templateUrl: './shift-history.component.html',
  styleUrl: './shift-history.component.css'
})
export class ShiftHistoryComponent implements OnInit, OnDestroy {
  // Component state
  loading = false;
  selectedDate = '';
  currentShift: Shift | null = null;
  shiftHistory: Shift[] | null = null;
  dateSummary: DateSummary[] | null = null;
  error: string | null = null;

  // Navigation limits
  isAtPastLimit = false;
  isAtFutureLimit = false;

  // Days for display
  days: DayInfo[] = [];

  // Destroy subject for subscription cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private shiftHistoryService: ShiftHistoryService,
    private loaderService: LoaderService
  ) {
  }

  ngOnInit(): void {
    // Subscribe to the shift history state
    this.shiftHistoryService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.loading = state.loading;
        this.selectedDate = state.selectedDate;
        this.currentShift = state.currentShift;
        this.shiftHistory = state.shiftHistory;
        this.dateSummary = state.dateSummary;
        this.error = state.error;

        // Update navigation limits
        this.isAtPastLimit = this.shiftHistoryService.isAtPastLimit(this.selectedDate);
        this.isAtFutureLimit = this.shiftHistoryService.isAtFutureLimit(this.selectedDate);
        if (this.loading) {
          this.loaderService.show();
        } else {
          this.loaderService.hide();
        }

        // Generate days from date summary
        this.generateDays();
      });

    // Initial load with today's date
    this.loadData(this.shiftHistoryService.formatDateToYYYYMMDD(new Date()));
  }

  /**
   * Load data for a specific date
   */
  loadData(date: string): void {
    this.shiftHistoryService.loadShiftHistory(date)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => {
          console.error('Error fetching shift history:', error);
          // Show error notification - typically would use a modal service
          alert(`Error: ${this.error || 'Failed to load shift history'}`);
        }
      });
  }

  /**
   * Generate days array from date summary
   */
  generateDays(): void {
    // Clear previous days
    this.days = [];
    if (!this.dateSummary) {
      this.shiftHistoryService.updateDateSummaryIfNeeded();
      return;
    }

    const today = this.shiftHistoryService.formatDateToYYYYMMDD(new Date());

    // Map date summary to day info
    this.dateSummary.forEach(summary => {
      const date = new Date(summary.date);

      this.days.push({
        date: summary.date,
        dayName: date.toLocaleDateString('en-US', {weekday: 'long'}),
        dayNumber: date.getDate(),
        hasShift: summary.total_shifts > 0,
        isToday: summary.date === today,
        isSelected: summary.date === this.selectedDate
      });
    });
  }

  /**
   * Select a specific day
   */
  selectDay(day: DayInfo): void {
    if (this.loading || day.date === this.selectedDate) {
      return; // Don't reload if already loading or already selected
    }

    // Update the selected day and load data
    this.loadData(day.date);
  }

  /**
   * Navigate to the next day
   */
  nextDay(): void {
    if (this.loading || this.isAtFutureLimit) return;

    this.shiftHistoryService.navigateToNextDay()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => {
          console.error('Error navigating to next day:', error);
          alert(`Error: ${this.error || 'Failed to navigate to next day'}`);
        }
      });
  }

  /**
   * Navigate to the previous day
   */
  previousDay(): void {
    if (this.loading || this.isAtPastLimit) return;

    this.shiftHistoryService.navigateToPreviousDay()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => {
          console.error('Error navigating to previous day:', error);
          alert(`Error: ${this.error || 'Failed to navigate to previous day'}`);
        }
      });
  }

  /**
   * Format a date for display in the UI
   */
  formatDate(dateString: string): string {
    if (!dateString) return ''
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Format time for display in the UI
   */
  formatTime(dateString: string): string {
    if (!dateString) return ''
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Calculate total hours for a shift
   */
  calculateTotalHours(shift: Shift): string {
    if (shift.date_start && shift.date_end) {
      const start = new Date(shift.date_start);
      const end = new Date(shift.date_end);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours.toFixed(1);
    }

    return shift.total_hours?.toString() || '0';
  }

  /**
   * Get text description for shift state
   */
  getShiftStateText(state?: ShiftState): string {
    if (state === undefined || state === null) return 'UNKNOWN'

    switch (state) {
      case ShiftState.NOT_STARTED:
        return 'NOT STARTED'
      case ShiftState.STARTED:
        return 'IN PROGRESS'
      case ShiftState.FINISHED:
        return 'COMPLETED'
      default:
        return 'UNKNOWN'
    }
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}
