import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgIconComponent, provideIcons} from '@ng-icons/core';
import {heroChevronDown, heroChevronLeft, heroChevronRight, heroPlus} from '@ng-icons/heroicons/outline';
import {ViewMode} from '@features/schedule/models/shared-types';

export interface Location {
  id: string;
  name: string;
}

export interface ShiftType {
  id: string;
  name: string;
}

@Component({
  selector: 'app-controls-bar',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroChevronLeft, heroChevronRight, heroChevronDown, heroPlus })],
  templateUrl: './controls-bar.component.html',
  styleUrl: './controls-bar.component.css'
})
export class ControlsBarComponent {
  @Input() currentDate: Date = new Date();
  @Input() viewMode: ViewMode = 'month';
  @Input() locations: Location[] = [];
  @Input() shiftTypes: ShiftType[] = [];
  @Input() selectedLocationId: string | null = null;
  @Input() selectedShiftTypeId: string | null = null;
  @Input() searchTags: string[] = [];

  @Output() previousClick = new EventEmitter<void>();
  @Output() nextClick = new EventEmitter<void>();
  @Output() todayClick = new EventEmitter<void>();
  @Output() viewModeChange = new EventEmitter<ViewMode>();
  @Output() locationChange = new EventEmitter<string>();
  @Output() shiftTypeChange = new EventEmitter<string>();
  @Output() addShift = new EventEmitter<void>();
  @Output() tagSearch = new EventEmitter<string>();
  @Output() tagRemove = new EventEmitter<string>();

  getCurrentMonthYearInfo(): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };
    return this.currentDate.toLocaleDateString('en-US', options);
  }

  getWeekRangeInfo(): string {
    if (this.viewMode === 'week') {
      const startOfWeek = new Date(this.currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }

    return `Week ${this.getWeekNumber(this.currentDate)}`;
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  onPreviousClick(): void {
    this.previousClick.emit();
  }

  onNextClick(): void {
    this.nextClick.emit();
  }

  onTodayClick(): void {
    this.todayClick.emit();
  }

  onViewModeChange(mode: ViewMode): void {
    this.viewModeChange.emit(mode);
  }

  onLocationChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.locationChange.emit(select.value);
  }

  onShiftTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.shiftTypeChange.emit(select.value);
  }

  onAddShift(): void {
    this.addShift.emit();
  }

  onTagRemove(tag: string): void {
    this.tagRemove.emit(tag);
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.trim()) {
      this.tagSearch.emit(input.value.trim());
      input.value = '';
    }
  }
}
