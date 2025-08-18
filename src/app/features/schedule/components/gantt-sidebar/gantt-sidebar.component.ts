import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../shared-types';

@Component({
  selector: 'app-gantt-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gantt-sidebar.component.html',
  styleUrl: './gantt-sidebar.component.css'
})
export class GanttSidebarComponent {
  @Input() employees: Employee[] = [];
  @Output() employeeClick = new EventEmitter<Employee>();

  onEmployeeClick(employee: Employee): void {
    this.employeeClick.emit(employee);
  }
}