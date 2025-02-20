import {Component} from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees = [
    {
      name: 'Soph Anderson',
      hours: '0.00Hrs/$0.00',
      photo:'https://replicate.delivery/xezq/dtSNleCKygXgBKFFo3VHR9q5X1EdnF6k2DyhsI1b8aFBPlIKA/out-0.png',
      shifts: [
        {time: '1:45am - 10:45am', person: 'Jeremy Becker'},
        {time: '2am - 10am', person: 'Adrian Abdipranoto'}
      ]
    },
    // Agrega más empleados aquí
  ];

}
