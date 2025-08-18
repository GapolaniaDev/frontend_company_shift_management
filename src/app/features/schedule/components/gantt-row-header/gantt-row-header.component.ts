import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Employee {
  id: string;
  name: string;
  avatar: string;
}

@Component({
  selector: 'app-gantt-row-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gantt-row-header.component.html',
  styleUrl: './gantt-row-header.component.css'
})
export class GanttRowHeaderComponent {
  @Input() employee!: Employee;
  @Input() isSelected: boolean = false;

  @Output() employeeClick = new EventEmitter<Employee>();

  onEmployeeClick(): void {
    this.employeeClick.emit(this.employee);
  }
}