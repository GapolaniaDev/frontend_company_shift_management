export interface Shift {
  id: number;
  shift_type_id: number;
  employee_id: number;
  date_start: string;
  date_end: string;
  total_hours?: number;
  weekday_code?: string;
  comments?: string;
  replacement_id?: number;
  location?: string;
  location_lat?: number;
  location_lng?: number;
  radius?: number;
  zoom?: number;
  clock_on_time?: string;
  clock_off_time?: string;
  clock_on_lat?: number;
  clock_on_lng?: number;
  clock_off_lat?: number;
  clock_off_lng?: number;
  created_at: string;
  updated_at: string;
  employee?: any; // Can be expanded to Employee interface
  shift_type?: any; // Can be expanded to ShiftType interface
  replacement?: any; // Can be expanded to Employee interface
}

export interface ShiftResponse {
  data: Shift[];
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

export interface ShiftCreateRequest {
  employee_id: number;
  shift_type_id: number;
  date_start: string;
  date_end: string;
  location?: string;
  location_lat?: number;
  location_lng?: number;
  radius?: number;
  zoom?: number;
}

export interface ShiftUpdateRequest {
  employee_id?: number;
  shift_type_id?: number;
  date_start?: string;
  date_end?: string;
  location?: string;
  location_lat?: number;
  location_lng?: number;
  radius?: number;
  zoom?: number;
}

export interface ClockUpdateRequest {
  lat: number;
  lng: number;
  type: 'clock_on' | 'clock_off';
}