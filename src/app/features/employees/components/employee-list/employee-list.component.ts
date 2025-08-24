import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { DataTableComponent } from '@shared/components/data-table/data-table.component';
import { 
  DataTableConfig, 
  DataTableColumn, 
  DataTableAction, 
  DataTableFilter,
  DataTableData,
  DataTableState 
} from '@shared/components/data-table/data-table.interfaces';

import { EmployeeService } from '@features/employees/data-access/employee.service';
import { Employee, EmployeeResponse } from '@features/employees/models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  tableData: DataTableData | null = null;
  loading = false;
  supervisors: { value: number; label: string }[] = [];
  
  // Properties for inline filters
  searchValue = '';
  supervisorFilter = '';
  entriesPerPage = 15;
  private searchSubject = new Subject<string>();

  tableConfig: DataTableConfig = {
    columns: [
      {
        key: 'first_name',
        label: 'First Name',
        sortable: true,
        type: 'text',
        mobileHidden: false
      },
      {
        key: 'last_name',
        label: 'Last Name',
        sortable: true,
        type: 'text',
        mobileHidden: false
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true,
        type: 'email',
        mobileHidden: true
      },
      {
        key: 'phone_number',
        label: 'Phone',
        sortable: false,
        type: 'text',
        mobileHidden: true
      },
      {
        key: 'supervisor.first_name',
        label: 'Supervisor',
        sortable: false,
        type: 'text',
        mobileHidden: true,
        formatter: (value, row) => {
          if (row.supervisor) {
            return `${row.supervisor.first_name} ${row.supervisor.last_name}`;
          }
          return 'No supervisor';
        }
      },
      {
        key: 'created_at',
        label: 'Created',
        sortable: true,
        type: 'date',
        mobileHidden: true
      }
    ],
    actions: [
      {
        label: 'View',
        color: 'secondary',
        action: (row: Employee) => this.viewEmployee(row)
      },
      {
        label: 'Edit',
        color: 'primary',
        action: (row: Employee) => this.editEmployee(row)
      },
      {
        label: 'Delete',
        color: 'danger',
        action: (row: Employee) => this.deleteEmployee(row)
      }
    ],
    filters: [], // Filtros desactivados porque los manejamos arriba
    searchable: false, // Búsqueda desactivada porque la manejamos arriba
    searchPlaceholder: '',
    searchDelay: 500,
    pageSizeOptions: [10, 25, 50, 100],
    defaultPageSize: 15,
    persistFilters: true,
    showLoading: true,
    sortBy: 'created_at',
    sortDir: 'desc'
  };

  ngOnInit() {
    this.loadSupervisors();
    
    // Configurar búsqueda con delay
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchValue = searchTerm;
      this.loadData();
    });

    // Carga inicial
    this.loadData();
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onTableStateChange(state: DataTableState) {
    // Solo maneja paginación y sorting, los filtros los manejamos arriba
    this.loading = true;
    
    this.employeeService.getEmployees(
      this.searchValue || undefined,
      this.supervisorFilter ? parseInt(this.supervisorFilter) : undefined,
      state.page,
      this.entriesPerPage,
      state.sortBy,
      state.sortDir
    ).pipe(
      map(response => this.transformResponse(response)),
      catchError(error => {
        console.error('Error loading employees:', error);
        this.loading = false;
        return of(null);
      })
    ).subscribe(data => {
      this.tableData = data;
      this.loading = false;
    });
  }


  private loadSupervisors() {
    // Por ahora cargaremos una lista simple de supervisores
    // Podrías agregar un endpoint específico para esto
    this.employeeService.getEmployees('', undefined, 1, 100).pipe(
      map(response => response.data.map(emp => ({
        value: emp.id,
        label: `${emp.first_name} ${emp.last_name}`
      }))),
      catchError(() => of([]))
    ).subscribe(supervisors => {
      this.supervisors = supervisors;
      // Actualizar las opciones del filtro
      const supervisorFilter = this.tableConfig.filters?.find(f => f.key === 'supervisor_id');
      if (supervisorFilter) {
        supervisorFilter.options = this.supervisors;
      }
    });
  }

  private transformResponse(response: EmployeeResponse): DataTableData {
    return {
      data: response.data,
      pagination: response.pagination
    };
  }

  // Action handlers
  viewEmployee(employee: Employee) {
    console.log('View employee:', employee);
    // Implementar navegación o modal de vista
  }

  editEmployee(employee: Employee) {
    this.router.navigate(['/employees', employee.id, 'edit']);
  }

  deleteEmployee(employee: Employee) {
    console.log('Delete employee:', employee);
    // Implementar confirmación y eliminación
  }

  addNewEmployee() {
    this.router.navigate(['/employees/new']);
  }

  // Methods for inline filters
  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  onSupervisorChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.supervisorFilter = target.value;
    this.loadData();
  }

  onEntriesPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.entriesPerPage = parseInt(target.value);
    this.loadData();
  }

  private loadData() {
    this.loading = true;
    
    this.employeeService.getEmployees(
      this.searchValue || undefined,
      this.supervisorFilter ? parseInt(this.supervisorFilter) : undefined,
      1, // Always start from page 1 when filters change
      this.entriesPerPage,
      'created_at',
      'desc'
    ).pipe(
      map(response => this.transformResponse(response)),
      catchError(error => {
        console.error('Error loading employees:', error);
        this.loading = false;
        return of(null);
      })
    ).subscribe(data => {
      this.tableData = data;
      this.loading = false;
    });
  }
}
