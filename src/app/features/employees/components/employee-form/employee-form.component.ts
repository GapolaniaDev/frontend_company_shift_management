import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';

import { EmployeeService } from '@features/employees/data-access/employee.service';
import { EmployeeDetail } from '@features/employees/models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  employeeForm!: FormGroup;
  employee: EmployeeDetail | null = null;
  loading = true;
  saving = false;
  error: string | null = null;
  employeeId!: number;
  isEditMode = false;

  // Role options
  roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'employee', label: 'Employee' }
  ];

  // Supervisor options (will be loaded dynamically)
  supervisorOptions: { value: number; label: string }[] = [];

  ngOnInit() {
    this.initializeForm();
    this.loadSupervisors();
    
    // Check if we're in edit mode
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['id']) {
        this.employeeId = parseInt(params['id']);
        this.isEditMode = true;
        this.loadEmployeeData();
      } else {
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.employeeForm = this.fb.group({
      // Personal Info
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^(\+61|0)[2-9]\d{8}$/)]],
      address: ['', Validators.required],
      
      // Employment Info
      role: ['employee', Validators.required],
      supervisor_id: [''],
      weekly_working_hours: [40, [Validators.required, Validators.min(1), Validators.max(168)]],
      
      // Financial Info
      tax_number: ['', Validators.pattern(/^\d{8,9}$/)], // TFN format
      abn: ['', Validators.pattern(/^\d{11}$/)], // ABN format
      bsb: ['', Validators.pattern(/^\d{6}$/)], // BSB format
      account: ['', Validators.pattern(/^\d{6,10}$/)] // Account number format
    });
  }

  private loadSupervisors() {
    // Load employees that can be supervisors (admin or supervisor role)
    this.employeeService.getEmployees('', undefined, 1, 100).pipe(
      map(response => response.data.filter(emp => emp.user?.role === 'admin' || emp.user?.role === 'supervisor').map(emp => ({
        value: emp.id,
        label: `${emp.first_name} ${emp.last_name}`
      }))),
      catchError(() => of([]))
    ).subscribe(supervisors => {
      this.supervisorOptions = supervisors;
    });
  }

  private loadEmployeeData() {
    this.loading = true;
    this.error = null;

    this.employeeService.getEmployeeDetail(this.employeeId).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error loading employee:', error);
        
        if (error.status === 404) {
          this.error = 'Employee not found';
        } else if (error.status === 403) {
          this.error = error.error?.message || 'Access denied';
        } else if (error.status === 401) {
          this.error = 'Please log in to edit this employee';
        } else {
          this.error = 'Failed to load employee data';
        }
        
        this.loading = false;
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe(employee => {
      this.employee = employee;
      this.loading = false;
      
      if (employee) {
        this.populateForm(employee);
      }
    });
  }

  private populateForm(employee: EmployeeDetail) {
    this.employeeForm.patchValue({
      first_name: employee.summary.first_name,
      last_name: employee.summary.last_name,
      email: employee.summary.email,
      phone_number: employee.summary.phone_number,
      address: employee.personal?.address || '',
      role: employee.user?.role || 'employee',
      supervisor_id: employee.supervisor?.id || '',
      weekly_working_hours: employee.summary.weekly_working_hours,
      tax_number: employee.personal?.tax_number || '',
      abn: employee.personal?.abn || '',
      bsb: employee.personal?.bsb || '',
      account: employee.personal?.account || ''
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.saving = true;
      
      const formData = this.employeeForm.value;
      
      // TODO: Implement save logic
      console.log('Form data to save:', formData);
      
      // Simulate save delay
      setTimeout(() => {
        this.saving = false;
        // Navigate back to employee detail view
        if (this.isEditMode) {
          this.router.navigate(['/employees', this.employeeId, 'view']);
        } else {
          // For new employee, navigate to employees list
          this.router.navigate(['/employees']);
        }
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.employeeForm);
    }
  }

  onCancel() {
    if (this.isEditMode) {
      this.router.navigate(['/employees', this.employeeId, 'view']);
    } else {
      this.router.navigate(['/employees']);
    }
  }

  goBack() {
    this.onCancel();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName.replace('_', ' ')} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['pattern']) {
        switch (fieldName) {
          case 'phone_number': return 'Please enter a valid Australian phone number';
          case 'tax_number': return 'TFN must be 8-9 digits';
          case 'abn': return 'ABN must be 11 digits';
          case 'bsb': return 'BSB must be 6 digits';
          case 'account': return 'Account number must be 6-10 digits';
          default: return 'Invalid format';
        }
      }
      if (field.errors['minlength']) return `${fieldName.replace('_', ' ')} is too short`;
      if (field.errors['min']) return 'Hours must be at least 1';
      if (field.errors['max']) return 'Hours cannot exceed 168 per week';
    }
    return '';
  }
}
