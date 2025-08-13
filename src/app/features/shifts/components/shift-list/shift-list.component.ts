import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Shift, ShiftResponse } from "@features/shifts/models/shift";
import {ShiftService} from "@features/shifts";
import {ConfirmationModalService} from "@core/services/confirmation-modal/confirmation-modal.service";

@Component({
  selector: 'app-shift-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: 'shift-list.component.html',
  styleUrl: 'shift-list.component.css'
})
export class ShiftListComponent implements OnInit, OnDestroy {
  shifts: Shift[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  totalPages = 0;
  totalItems = 0;
  itemsPerPage = 10;

  // Filters
  dateFrom: string | null = null;
  dateTo: string | null = null;
  shiftTypeId: number | null = null;

  // For cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private shiftService: ShiftService,
    private confirmationModalService: ConfirmationModalService
  ) {}

  ngOnInit(): void {
    this.loadShifts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadShifts(): void {
    this.loading = true;
    this.error = null;

    this.shiftService.getShifts(
      this.dateFrom || undefined,
      this.dateTo || undefined,
      this.shiftTypeId || undefined,
      this.currentPage,
      this.itemsPerPage
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: ShiftResponse) => {
        this.shifts = response.data;

        if (response.meta) {
          this.totalPages = response.meta.last_page;
          this.totalItems = response.meta.total;
        }

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading shifts. Please try again.';
        this.loading = false;
        console.error('Failed to load shifts', err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadShifts();
  }

  resetFilters(): void {
    this.dateFrom = null;
    this.dateTo = null;
    this.shiftTypeId = null;
    this.currentPage = 1;
    this.loadShifts();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadShifts();
    }
  }

  deleteShift(id: number): void {
    this.confirmationModalService.open(
      'Are you sure you want to delete this shift? This action cannot be undone.',
      () => {
        this.shiftService.deleteShift(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadShifts();
            },
            error: (err) => {
              this.error = 'Error deleting shift. Please try again.';
              console.error('Failed to delete shift', err);
            }
          });
      }
    );
  }

  // Helper for date formatting
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

}
