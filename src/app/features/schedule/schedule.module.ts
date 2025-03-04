import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ScheduleComponent,
    CalendarHeaderComponent,
    EmployeeListComponent,
    NavigationBarComponent,
    SearchBarComponent,
    StatusBarComponent
  ],
  exports: [
    ScheduleComponent
  ]
})
export class ScheduleModule { }