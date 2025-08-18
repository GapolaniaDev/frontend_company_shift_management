import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsBarComponent } from '../controls-bar/controls-bar.component';
import { GanttHeaderComponent } from '../gantt-header/gantt-header.component';
import { GanttRowComponent } from '../gantt-row/gantt-row.component';
import { Employee, Shift, ViewMode } from '../shared-types';

@Component({
  selector: 'app-gantt-container',
  standalone: true,
  imports: [CommonModule, ControlsBarComponent, GanttHeaderComponent, GanttRowComponent],
  templateUrl: './gantt-container.component.html',
  styleUrl: './gantt-container.component.css'
})
export class GanttContainerComponent {
  @Input() employees: Employee[] = [];
  @Input() currentDate: Date = new Date();
  @Input() viewMode: ViewMode = 'month';
  @Input() isLoading: boolean = false;
  @Input() error: string | null = null;
  @Input() locations: any[] = [];
  @Input() shiftTypes: any[] = [];
  @Input() selectedLocationId: string | null = null;
  @Input() selectedShiftTypeId: string | null = null;
  @Input() searchTags: string[] = [];

  @Output() shiftClick = new EventEmitter<{ shift: Shift; employee: Employee; date: string }>();
  @Output() cellClick = new EventEmitter<{ employee: Employee; date: string }>();
  @Output() addShift = new EventEmitter<void>();
  @Output() previousClick = new EventEmitter<void>();
  @Output() nextClick = new EventEmitter<void>();
  @Output() todayClick = new EventEmitter<void>();
  @Output() viewModeChange = new EventEmitter<ViewMode>();
  @Output() locationChange = new EventEmitter<string>();
  @Output() shiftTypeChange = new EventEmitter<string>();

  getDaysInCurrentView(): Date[] {
    const days: Date[] = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    switch (this.viewMode) {
      case 'month':
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          days.push(new Date(year, month, i));
        }
        break;
      case 'week':
        const startOfWeek = new Date(this.currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        for (let i = 0; i < 7; i++) {
          const day = new Date(startOfWeek);
          day.setDate(startOfWeek.getDate() + i);
          days.push(day);
        }
        break;
      case 'day':
        days.push(new Date(this.currentDate));
        break;
    }
    
    return days;
  }

  onShiftClick(shift: Shift, employee: Employee, date: string): void {
    this.shiftClick.emit({ shift, employee, date });
  }

  onCellClick(employee: Employee, date: string): void {
    this.cellClick.emit({ employee, date });
  }

  onAddShift(): void {
    this.addShift.emit();
  }

  trackByEmployee = (index: number, employee: Employee): string => {
    return employee.id;
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

  onLocationChange(locationId: string): void {
    this.locationChange.emit(locationId);
  }

  onShiftTypeChange(shiftTypeId: string): void {
    this.shiftTypeChange.emit(shiftTypeId);
  }
}