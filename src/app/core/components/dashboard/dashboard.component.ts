import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "../../../services/employee/employee.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  employees: any[] = [];

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(
      data => {
        this.employees = data;
      },
      error => {
        console.error('Error al obtener los empleados', error);
      }
    );
  }
}
