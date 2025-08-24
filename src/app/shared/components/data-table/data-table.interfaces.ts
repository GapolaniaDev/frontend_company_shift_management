export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'number' | 'email';
  width?: string;
  mobileHidden?: boolean;
  formatter?: (value: any, row: any) => string;
}

export interface DataTableAction {
  label: string;
  icon?: string;
  color: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  action: (row: any) => void;
  visible?: (row: any) => boolean;
}

export interface DataTableFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: { value: any; label: string }[];
  placeholder?: string;
}

export interface DataTableConfig {
  columns: DataTableColumn[];
  actions?: DataTableAction[];
  filters?: DataTableFilter[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchDelay?: number;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  persistFilters?: boolean;
  showLoading?: boolean;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface DataTableData {
  data: any[];
  pagination: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links: {
      next: string | null;
      prev: string | null;
      first: string;
      last: string;
    };
  };
}

export interface DataTableState {
  search: string;
  page: number;
  perPage: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  filters: { [key: string]: any };
}