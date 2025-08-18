import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftBlockComponent } from '../shift-block/shift-block.component';
import { Shift } from '../shared-types';

@Component({
  selector: 'app-gantt-cell',
  standalone: true,
  imports: [CommonModule, ShiftBlockComponent],
  templateUrl: './gantt-cell.component.html',
  styleUrl: './gantt-cell.component.css'
})
export class GanttCellComponent {
  @Input() shifts: Shift[] = [];
  @Input() date: Date = new Date();
  @Input() isEmpty: boolean = true;
  @Input() isSelected: boolean = false;

  @Output() cellClick = new EventEmitter<Date>();
  @Output() shiftClick = new EventEmitter<Shift>();
  @Output() shiftHover = new EventEmitter<Shift>();

  get hasShifts(): boolean {
    return this.shifts && this.shifts.length > 0;
  }

  get isOverflowing(): boolean {
    return this.shifts && this.shifts.length > 3;
  }

  get displayShifts(): Shift[] {
    return this.shifts?.slice(0, 3) || [];
  }

  get remainingCount(): number {
    return Math.max(0, (this.shifts?.length || 0) - 3);
  }

  onCellClick(event: MouseEvent): void {
    if (!this.hasShifts) {
      this.cellClick.emit(this.date);
    }
  }

  onShiftClick(shift: Shift): void {
    this.shiftClick.emit(shift);
  }

  onShiftHover(shift: Shift): void {
    this.shiftHover.emit(shift);
  }

  trackByShiftId = (index: number, shift: Shift): string => {
    return shift.id;
  }
}