import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GanttCellComponent} from '../gantt-cell/gantt-cell.component';
import {Employee, Shift} from '../shared-types';

@Component({
  selector: 'app-gantt-row-cells',
  standalone: true,
  imports: [CommonModule, GanttCellComponent],
  templateUrl: './gantt-row-cells.component.html',
  styleUrl: './gantt-row-cells.component.css'
})
export class GanttRowCellsComponent {
  @Input() employee!: Employee;
  @Input() days: Date[] = [];
  @Input() selectedDate: string | null = null;

  @Output() cellClick = new EventEmitter<string>();
  @Output() shiftClick = new EventEmitter<{ shift: Shift; date: string }>();
  @Output() shiftHover = new EventEmitter<{ shift: Shift; date: string }>();

  getShiftsForDate(date: Date): Shift[] {
    const dateKey = this.formatDateKey(date);
    return this.employee.shifts[dateKey] || [];
  }

  isDateSelected(date: Date): boolean {
    return this.formatDateKey(date) === this.selectedDate;
  }

  formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  onCellClick(date: Date): void {
    this.cellClick.emit(this.formatDateKey(date));
  }

  onShiftClick(shift: Shift, date: Date): void {
    this.shiftClick.emit({ shift, date: this.formatDateKey(date) });
  }

  onShiftHover(shift: Shift, date: Date): void {
    this.shiftHover.emit({ shift, date: this.formatDateKey(date) });
  }

  trackByDate = (index: number, date: Date): string => {
    return this.formatDateKey(date);
  }
}
