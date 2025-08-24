import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GanttRowHeaderComponent} from "@features/schedule/components/gantt-row-header/gantt-row-header.component";
import {GanttRowCellsComponent} from '@features/schedule/components/gantt-row-cells/gantt-row-cells.component';
import {Employee, Shift} from '@features/schedule/components/shared-types';

@Component({
  selector: 'app-gantt-row',
  standalone: true,
  imports: [CommonModule, GanttRowHeaderComponent, GanttRowCellsComponent],
  templateUrl: './gantt-row.component.html',
  styleUrl: './gantt-row.component.css'
})
export class GanttRowComponent {
  @Input() employee!: Employee;
  @Input() days: Date[] = [];
  @Input() selectedEmployeeId: string | null = null;
  @Input() selectedDate: string | null = null;

  @Output() employeeClick = new EventEmitter<Employee>();
  @Output() cellClick = new EventEmitter<string>();
  @Output() shiftClick = new EventEmitter<{ shift: Shift; date: string }>();
  @Output() shiftHover = new EventEmitter<{ shift: Shift; date: string }>();

  get isEmployeeSelected(): boolean {
    return this.employee.id === this.selectedEmployeeId;
  }

  getGridTemplateColumns(): string {
    return `250px repeat(${this.days.length}, 52px)`;
  }

  onEmployeeClick(employee: Employee): void {
    this.employeeClick.emit(employee);
  }

  onCellClick(date: string): void {
    this.cellClick.emit(date);
  }

  onShiftClick(event: { shift: Shift; date: string }): void {
    this.shiftClick.emit(event);
  }

  onShiftHover(event: { shift: Shift; date: string }): void {
    this.shiftHover.emit(event);
  }
}
