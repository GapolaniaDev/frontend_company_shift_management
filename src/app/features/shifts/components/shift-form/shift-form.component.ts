import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {catchError, finalize, Observable, of, Subject, takeUntil} from 'rxjs';
import {ShiftService} from "@features/shifts";
import {ShiftTypeService} from '../../data-access/shift-types/shift-type.service';
import {EmployeeService} from '../../data-access/employees/employee.service';
import {Employee} from '../../models/employee.model';
import {ShiftType} from "@features/shifts/models/shift-type.model";
import {Shift} from "@features/shifts/models/shift";

@Component({
  selector: 'app-shift-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './shift-form.component.html',
  styleUrl: './shift-form.component.css'
})
export class ShiftFormComponent implements OnInit, OnDestroy {
  shiftForm: FormGroup;
  isEditMode = false;
  shiftId: number | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;
  success: string | null = null;

  employees: Employee[] = [];
  shiftTypes: ShiftType[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private shiftService: ShiftService,
    private shiftTypeService: ShiftTypeService,
    private employeeService: EmployeeService
  ) {
    this.shiftForm = this.fb.group({
      employee_id: ['', Validators.required],
      shift_type_id: ['', Validators.required],
      date_start: ['', Validators.required],
      date_end: ['', Validators.required],
      location: [''],
      location_lat: [null],
      location_lng: [null],
      radius: [null],
      zoom: [null]
    });
  }

  ngOnInit(): void {
    this.loadDependencies();

    // Check if we're in edit mode
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.shiftId = +id;
        this.loadShiftDetails(+id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load required data (employees, shift types)
   */
  loadDependencies(): void {
    this.loading = true;

    // Load employees
    this.employeeService.getEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.employees = response.data;
        },
        error: (err) => {
          console.error('Failed to load employees', err);
          this.error = 'Failed to load employees. Please refresh the page.'
        }
      });

    // Load shift types
    this.shiftTypeService.getShiftTypes()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.shiftTypes = response.data;
        },
        error: (err) => {
          console.error('Failed to load shift types', err);
          this.error = 'Failed to load shift types. Please refresh the page.'
        }
      });
  }

  /**
   * Load shift details for editing
   */
  loadShiftDetails(id: number): void {
    this.loading = true;

    this.shiftService.getShiftById(id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (shift: Shift) => {
          // Convert date strings to input-compatible format
          const dateStart = new Date(shift.date_start!);
          const dateEnd = new Date(shift.date_end!);

          // Format dates for input (YYYY-MM-DDThh:mm)
          const formattedDateStart = this.formatDateForInput(dateStart);
          const formattedDateEnd = this.formatDateForInput(dateEnd);

          this.shiftForm.patchValue({
            employee_id: shift.employee_id,
            shift_type_id: shift.shift_type_id,
            date_start: formattedDateStart,
            date_end: formattedDateEnd,
            location: shift.location || '',
            location_lat: shift.location_lat || null,
            location_lng: shift.location_lng || null,
            radius: shift.radius || null,
            zoom: shift.zoom || null
          });
        },
        error: (err) => {
          console.error('Failed to load shift details', err);
          this.error = 'Failed to load shift details. Please try again.';
        }
      });
  }

  /**
   * Format date for datetime-local input (YYYY-MM-DDThh:mm)
   */
  formatDateForInput(date: Date): string {
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.shiftForm.invalid) {
      return;
    }

    this.submitting = true;
    this.error = null;
    this.success = null;

    // Create observable based on whether we're creating or updating
    const action$: Observable<Shift> = this.isEditMode && this.shiftId
      ? this.shiftService.updateShift(this.shiftId, this.shiftForm.value)
      : this.shiftService.createShift(this.shiftForm.value);

    action$.pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.submitting = false;
      }),
      catchError(err => {
        console.error('Error saving shift', err);
        this.error = 'Failed to save shift. Please check the form and try again.';
        return of(null);
      })
    ).subscribe(shift => {
      if (shift) {
        if (this.isEditMode) {
          this.success = 'Shift updated successfully!';
        } else {
          this.success = 'Shift created successfully!';
          this.shiftForm.reset();

          setTimeout(() => {
            this.router.navigate(['/shifts']);
          }, 1500);
        }
      }
    });
  }

  /**
   * Reset the form
   */
  resetForm(): void {
    if (this.isEditMode && this.shiftId) {
      this.loadShiftDetails(this.shiftId);
    } else {
      this.shiftForm.reset();
    }
    this.error = null;
    this.success = null;
  }
}
