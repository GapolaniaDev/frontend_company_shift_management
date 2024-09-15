import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "../../../services/employee/employee.service";
import { CommonModule } from '@angular/common';
import {ShiftService} from "../../../services/shift/shift.service";

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
  shifts: any[] = [];

  constructor(private shiftService: ShiftService) {
  }

  ngOnInit(): void {
    this.shiftService.getShifts().subscribe(
      data => {
        this.shifts = data;
      },
      error => {
        console.error('Error al obtener los turnos', error);
      }
    );
  }
}
