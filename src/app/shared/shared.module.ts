import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NgIconsModule } from './ng-icons.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgIconsModule,
    PaginationComponent
  ],
  exports: [
    PaginationComponent,
    NgIconsModule
  ]
})
export class SharedModule { }