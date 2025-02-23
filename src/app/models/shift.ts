// shift.model.ts
export interface Shift {
  id: number;
  shift_type_id: number | null;
  employee_id: number | null;
  date_start: string | null;
  date_end: string | null;
  total_hours: string | null;
  weekday_code: string | null;
  comments: string | null;
  replacement_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  status: number | null;
  date_start_employee: string | null;
  date_finish_employee: string | null;
  location_lat: number | 0;
  location_lng: number | 0;
  clock_on_lat: number | 0;
  clock_on_lng: number | 0;
  clock_off_lat: number | 0;
  clock_off_lng: number | 0;
}

// Constante para un objeto Shift por defecto
export const defaultShift: Shift = {
  id: 0,
  shift_type_id: null,
  employee_id: null,
  date_start: null,
  date_end: null,
  total_hours: null,
  weekday_code: null,
  comments: null,
  replacement_id: null,
  created_at: null,
  updated_at: null,
  status: null,
  date_start_employee: null,
  date_finish_employee: null,
  location_lat: 0,
  location_lng: 0,
  clock_on_lat: 0,
  clock_on_lng: 0,
  clock_off_lat: 0,
  clock_off_lng: 0

};
