import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  DataTableColumn,
  DataTableAction,
  DataTableFilter,
  DataTableConfig,
  DataTableData,
  DataTableState
} from './data-table.interfaces';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private searchSubject = new Subject<string>();
  
  // Expose Math for template
  Math = Math;

  @Input() config!: DataTableConfig;
  @Input() data: DataTableData | null = null;
  @Input() loading = false;

  @Output() stateChange = new EventEmitter<DataTableState>();

  state: DataTableState = {
    search: '',
    page: 1,
    perPage: 15,
    sortBy: 'created_at',
    sortDir: 'desc',
    filters: {}
  };

  ngOnInit() {
    // Inicializar estado desde configuración
    if (this.config.defaultPageSize) {
      this.state.perPage = this.config.defaultPageSize;
    }
    if (this.config.sortBy) {
      this.state.sortBy = this.config.sortBy;
    }
    if (this.config.sortDir) {
      this.state.sortDir = this.config.sortDir;
    }

    // Configurar búsqueda con delay
    const searchDelay = this.config.searchDelay || 500;
    this.searchSubject.pipe(
      debounceTime(searchDelay),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.state.search = searchTerm;
      this.state.page = 1; // Reset to first page on search
      this.emitStateChange();
    });

    // Cargar estado desde URL si está configurado
    if (this.config.persistFilters) {
      this.loadStateFromUrl();
    }

    // Emitir estado inicial
    this.emitStateChange();
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  onFilterInput(filterKey: string, event: Event) {
    const target = event.target as HTMLInputElement;
    this.onFilterChange(filterKey, target.value);
  }

  onFilterSelect(filterKey: string, event: Event) {
    const target = event.target as HTMLSelectElement;
    this.onFilterChange(filterKey, target.value);
  }

  onFilterChange(filterKey: string, value: any) {
    this.state.filters[filterKey] = value;
    this.state.page = 1; // Reset to first page on filter
    this.emitStateChange();
  }

  onSort(column: DataTableColumn) {
    if (!column.sortable) return;

    if (this.state.sortBy === column.key) {
      this.state.sortDir = this.state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortBy = column.key;
      this.state.sortDir = 'asc';
    }
    this.emitStateChange();
  }

  onPageChange(page: number) {
    this.state.page = page;
    this.emitStateChange();
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.state.perPage = parseInt(target.value);
    this.state.page = 1; // Reset to first page
    this.emitStateChange();
  }

  onActionClick(action: DataTableAction, row: any) {
    action.action(row);
  }

  isActionVisible(action: DataTableAction, row: any): boolean {
    return action.visible ? action.visible(row) : true;
  }

  formatCellValue(column: DataTableColumn, row: any): string {
    const value = this.getCellValue(column.key, row);
    
    if (column.formatter) {
      return column.formatter(value, row);
    }

    if (value === null || value === undefined) {
      return '-';
    }

    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'email':
        return value;
      case 'number':
        return value.toString();
      default:
        return value.toString();
    }
  }

  getCellValue(key: string, row: any): any {
    return key.split('.').reduce((obj, prop) => obj?.[prop], row);
  }

  getSortIcon(column: DataTableColumn): string {
    if (!column.sortable) return '';
    if (this.state.sortBy !== column.key) return '↕️';
    return this.state.sortDir === 'asc' ? '↑' : '↓';
  }

  getPaginationArray(): number[] {
    if (!this.data?.pagination) return [];
    
    const totalPages = this.data.pagination.total_pages;
    const currentPage = this.data.pagination.current_page;
    const pages: number[] = [];

    // Mostrar máximo 5 páginas
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    // Ajustar si no hay suficientes páginas al final
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  private emitStateChange() {
    this.stateChange.emit({ ...this.state });
    
    if (this.config.persistFilters) {
      this.updateUrl();
    }
  }

  private loadStateFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('search')) this.state.search = urlParams.get('search') || '';
    if (urlParams.has('page')) this.state.page = parseInt(urlParams.get('page') || '1');
    if (urlParams.has('per_page')) this.state.perPage = parseInt(urlParams.get('per_page') || '15');
    if (urlParams.has('sort_by')) this.state.sortBy = urlParams.get('sort_by') || 'created_at';
    if (urlParams.has('sort_dir')) this.state.sortDir = (urlParams.get('sort_dir') || 'desc') as 'asc' | 'desc';

    // Cargar filtros personalizados
    this.config.filters?.forEach(filter => {
      if (urlParams.has(filter.key)) {
        this.state.filters[filter.key] = urlParams.get(filter.key);
      }
    });
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  getActionButtonClass(color: string): string {
    const baseClass = 'inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 ';
    
    switch (color) {
      case 'primary':
        return baseClass + 'bg-[#1F8C45] text-white hover:bg-[#1A7A3A]';
      case 'secondary':
        return baseClass + 'bg-[#1D5A73] text-white hover:bg-[#154A5E]';
      case 'danger':
        return baseClass + 'bg-red-600 text-white hover:bg-red-700';
      case 'success':
        return baseClass + 'bg-[#97BF41] text-white hover:bg-[#85A835]';
      case 'warning':
        return baseClass + 'bg-yellow-500 text-white hover:bg-yellow-600';
      default:
        return baseClass + 'bg-gray-600 text-white hover:bg-gray-700';
    }
  }

  private updateUrl() {
    const params = new URLSearchParams();
    
    if (this.state.search) params.set('search', this.state.search);
    if (this.state.page > 1) params.set('page', this.state.page.toString());
    if (this.state.perPage !== 15) params.set('per_page', this.state.perPage.toString());
    if (this.state.sortBy !== 'created_at') params.set('sort_by', this.state.sortBy);
    if (this.state.sortDir !== 'desc') params.set('sort_dir', this.state.sortDir);

    // Agregar filtros personalizados
    Object.entries(this.state.filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    this.router.navigateByUrl(newUrl, { replaceUrl: true });
  }
}