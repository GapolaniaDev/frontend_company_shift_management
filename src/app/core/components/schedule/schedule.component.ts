import { Component } from '@angular/core';
import {NavigationBarComponent} from "./navigation-bar/navigation-bar.component";
import {SearchBarComponent} from "./search-bar/search-bar.component";
import {CalendarHeaderComponent} from "./calendar-header/calendar-header.component";
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {StatusBarComponent} from "./status-bar/status-bar.component";

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    NavigationBarComponent,
    SearchBarComponent,
    CalendarHeaderComponent,
    EmployeeListComponent,
    StatusBarComponent
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {

}
