import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShiftsRoutingModule } from './shifts-routing.module';
import { ShiftListComponent } from './components/shift-list/shift-list.component';
import { ShiftFormComponent } from './components/shift-form/shift-form.component';
import { ShiftDetailsComponent } from './components/shift-details/shift-details.component';
import { ShiftTypesComponent } from './components/shift-types/shift-types.component';
import { ShiftSettingsComponent } from './components/shift-settings/shift-settings.component';
import { ClockComponent } from './components/clock/clock.component';
import { MapsComponent } from './components/maps/maps.component';
import { NoShiftDetailsComponent } from './components/no-shift-details/no-shift-details.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ShiftsRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ShiftListComponent,
    ShiftFormComponent,
    ShiftDetailsComponent,
    ShiftTypesComponent,
    ShiftSettingsComponent,
    ClockComponent,
    MapsComponent,
    NoShiftDetailsComponent
  ],
  exports: [
    ShiftListComponent,
    ShiftFormComponent,
    ShiftDetailsComponent,
    ClockComponent,
    MapsComponent
  ]
})
export class ShiftsModule { }