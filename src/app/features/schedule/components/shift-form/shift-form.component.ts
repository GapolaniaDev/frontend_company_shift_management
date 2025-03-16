import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Shift } from '../../../../models/shift.model';
import { SharedNgIconsModule } from '../../../../shared/ng-icons.module';

@Component({
  selector: 'app-shift-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedNgIconsModule
  ],
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-lg w-full">
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ shift?.id ? 'Edit Shift' : 'Add New Shift' }}
          </h3>
          <button (click)="onClose()" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <span class="sr-only">Close</span>
            <ng-icon name="heroXMark"></ng-icon>
          </button>
        </div>
        
        <form [formGroup]="shiftForm" (ngSubmit)="onSubmit()" class="p-6">
          <div class="space-y-4">
            <!-- Employee Selection -->
            <div>
              <label for="employee" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employee
              </label>
              <select 
                id="employee"
                formControlName="employee_id"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option *ngFor="let employee of employees" [value]="employee.id">
                  {{ employee.name }}
                </option>
              </select>
              <div *ngIf="shiftForm.get('employee_id')?.invalid && shiftForm.get('employee_id')?.touched" class="mt-1 text-sm text-red-600 dark:text-red-500">
                Please select an employee
              </div>
            </div>
            
            <!-- Shift Type Selection -->
            <div>
              <label for="shift_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Shift Type
              </label>
              <select 
                id="shift_type"
                formControlName="shift_type_id"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option [value]="1">Morning Shift (6AM-2PM)</option>
                <option [value]="2">Afternoon Shift (2PM-10PM)</option>
                <option [value]="3">Night Shift (10PM-6AM)</option>
              </select>
              <div *ngIf="shiftForm.get('shift_type_id')?.invalid && shiftForm.get('shift_type_id')?.touched" class="mt-1 text-sm text-red-600 dark:text-red-500">
                Please select a shift type
              </div>
            </div>
            
            <!-- Date Selection -->
            <div>
              <label for="shift_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Shift Date
              </label>
              <input 
                type="date"
                id="shift_date"
                formControlName="shift_date"
                class="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <div *ngIf="shiftForm.get('shift_date')?.invalid && shiftForm.get('shift_date')?.touched" class="mt-1 text-sm text-red-600 dark:text-red-500">
                Please select a valid date
              </div>
            </div>
            
            <!-- Start Time and End Time will be determined by shift type -->
            
            <!-- Comments -->
            <div>
              <label for="comments" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Comments (Optional)
              </label>
              <textarea
                id="comments"
                formControlName="comments"
                rows="3"
                class="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Add any notes about this shift"></textarea>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button"
              (click)="onClose()"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button 
              type="submit"
              [disabled]="shiftForm.invalid"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ shift?.id ? 'Update Shift' : 'Add Shift' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ShiftFormComponent {
  @Input() shift: Partial<Shift> | null = null;
  @Input() date: Date | null = null;
  @Output() save = new EventEmitter<Partial<Shift>>();
  @Output() close = new EventEmitter<void>();

  shiftForm: FormGroup;
  
  // Mock employees for demo
  employees = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Mike Davis' },
    { id: 4, name: 'Emily Wilson' }
  ];

  constructor(private fb: FormBuilder) {
    this.shiftForm = this.fb.group({
      employee_id: ['', Validators.required],
      shift_type_id: ['', Validators.required],
      shift_date: [new Date().toISOString().substring(0, 10), Validators.required],
      comments: ['']
    });
  }

  ngOnInit(): void {
    if (this.shift) {
      // If editing an existing shift
      const shiftDate = new Date(this.shift.date_start || '');
      
      this.shiftForm.patchValue({
        employee_id: this.shift.employee_id,
        shift_type_id: this.shift.shift_type_id,
        shift_date: shiftDate.toISOString().substring(0, 10),
        comments: this.shift.comments
      });
    } else if (this.date) {
      // If creating a new shift with a pre-selected date
      this.shiftForm.patchValue({
        shift_date: this.date.toISOString().substring(0, 10)
      });
    }
  }

  onSubmit(): void {
    if (this.shiftForm.valid) {
      const formValues = this.shiftForm.value;
      
      // Convert the selected date and shift type to actual start/end times
      const shiftDate = new Date(formValues.shift_date);
      let startHour: number, endHour: number;
      
      switch (parseInt(formValues.shift_type_id)) {
        case 1: // Morning
          startHour = 6;
          endHour = 14;
          break;
        case 2: // Afternoon
          startHour = 14;
          endHour = 22;
          break;
        case 3: // Night
          startHour = 22;
          endHour = 6; // Next day
          break;
        default:
          startHour = 9;
          endHour = 17;
      }
      
      const dateStart = new Date(shiftDate);
      dateStart.setHours(startHour, 0, 0, 0);
      
      const dateEnd = new Date(shiftDate);
      if (formValues.shift_type_id === 3) {
        // For night shift, end time is the next day
        dateEnd.setDate(dateEnd.getDate() + 1);
      }
      dateEnd.setHours(endHour, 0, 0, 0);
      
      const shiftData: Partial<Shift> = {
        ...this.shift, // Preserve existing data if editing
        employee_id: parseInt(formValues.employee_id),
        shift_type_id: parseInt(formValues.shift_type_id),
        date_start: dateStart.toISOString(),
        date_end: dateEnd.toISOString(),
        comments: formValues.comments
      };
      
      this.save.emit(shiftData);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}