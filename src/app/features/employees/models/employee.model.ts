export interface Employee {
  id: number;
  user_id?: number;
  supervisor_id?: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  address?: string;
  tax_number?: string;
  abn?: string;
  bsb?: string;
  account?: string;
  created_at: string;
  updated_at: string;
  supervisor?: Employee;
  user?: any; // Can be expanded to User interface
  shifts?: any[]; // Can be expanded to Shift interface array
}

export interface EmployeeResponse {
  success: boolean;
  data: Employee[];
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

export interface EmployeeCreateRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  address?: string;
  tax_number?: string;
  abn?: string;
  bsb?: string;
  account?: string;
  supervisor_id?: number;
  user_id?: number;
}

export interface EmployeeUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  supervisor_id?: number;
}

export interface AssignSupervisorRequest {
  supervisor_id: number;
}