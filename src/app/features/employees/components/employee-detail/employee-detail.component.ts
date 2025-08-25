import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';

import { EmployeeService } from '@features/employees/data-access/employee.service';
import { EmployeeDetail } from '@features/employees/models/employee.model';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.css'
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  employee: EmployeeDetail | null = null;
  loading = true;
  error: string | null = null;
  employeeId!: number;

  ngOnInit() {
    // Get employee ID from route parameters
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.employeeId = parseInt(params['id']);
      if (this.employeeId) {
        this.loadEmployeeDetail();
      } else {
        this.error = 'Invalid employee ID';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEmployeeDetail() {
    this.loading = true;
    this.error = null;

    this.employeeService.getEmployeeDetail(this.employeeId).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error loading employee detail:', error);
        
        if (error.status === 404) {
          this.error = 'Employee not found';
        } else if (error.status === 403) {
          this.error = error.error?.message || 'Access denied';
        } else if (error.status === 401) {
          this.error = 'Please log in to view this employee';
        } else {
          this.error = 'Failed to load employee details';
        }
        
        this.loading = false;
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe(employee => {
      this.employee = employee;
      this.loading = false;
    });
  }

  goBack() {
    this.router.navigate(['/employees']);
  }

  editEmployee() {
    this.router.navigate(['/employees', this.employeeId, 'edit']);
  }

  getStatusBadgeClass(status: string): string {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ';
    
    switch (status.toLowerCase()) {
      case 'active':
      case 'accepted':
      case 'confirmed':
        return baseClass + 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'not_started':
        return baseClass + 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected':
      case 'cancelled':
        return baseClass + 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed':
        return baseClass + 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return baseClass + 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  getUrgencyBadgeClass(urgency: string): string {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ';
    
    switch (urgency.toLowerCase()) {
      case 'high':
        return baseClass + 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return baseClass + 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return baseClass + 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return baseClass + 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  formatHours(hours: number): string {
    return `${hours}h`;
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  formatLastActivity(employee: EmployeeDetail): string {
    const lastActivity = employee.audit?.last_session?.last_activity;
    return lastActivity ? this.formatDateTime(lastActivity) : 'N/A';
  }

  getShiftBorderClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'not_started':
      case 'pending':
        return 'border-l-4 border-muted-highlight';
      case 'in_progress':
      case 'started':
      case 'active':
        return 'border-l-4 border-bright-primary';
      case 'completed':
      case 'finished':
        return 'border-l-4 border-full-accent1';
      case 'cancelled':
      case 'rejected':
        return 'border-l-4 border-red-400';
      default:
        return 'border-l-4 border-red-400';
    }
  }
}