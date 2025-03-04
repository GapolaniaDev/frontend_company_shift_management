export interface ShiftConfiguration {
  id: number;
  shift_type_id: number;
  employee_id: number;
  shift_duration?: number;
  created_at: string;
  updated_at: string;
  employee?: any; // Can be expanded to Employee interface
  shift_type?: any; // Can be expanded to ShiftType interface
}

export interface ShiftConfigurationResponse {
  data: ShiftConfiguration[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    links: any[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ShiftConfigurationCreateRequest {
  shift_type_id: number;
  employee_id: number;
  shift_duration?: number;
}

export interface ShiftConfigurationUpdateRequest {
  shift_type_id?: number;
  employee_id?: number;
  shift_duration?: number;
}