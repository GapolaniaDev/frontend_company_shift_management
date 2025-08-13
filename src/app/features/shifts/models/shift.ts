// shift.ts
export enum ShiftState {
  NOT_STARTED = 0,
  STARTED = 1,
  FINISHED = 2
}

export interface Shift {
  id: number;
  shift_type_id: number | null;
  shift_type?: any;
  employee_id: number | null;
  employee?: any;
  date_start: string | null;
  date_end: string | null;
  total_hours: string | number | null;
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
  clock_on_time: string | null;
  clock_off_time: string | null;
  local_clock_on_time: string | null; // Hora local de inicio del turno
  local_clock_off_time: string | null; // Hora local de fin del turno (para simetría)
  radius: number | null;
  zoom: number | null;
  state: ShiftState;
  location?: string;
}

export const defaultShift: Shift = {
  id: 0,
  shift_type_id: null,
  shift_type: null,
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
  clock_off_lng: 0,
  clock_on_time: null,
  clock_off_time: null,
  local_clock_on_time: null,
  local_clock_off_time: null,
  radius: 0,
  zoom: 0,
  state: ShiftState.NOT_STARTED
};

export function mapToShift(data: any): Shift {
  return {
    ...defaultShift,
    id: data.id || defaultShift.id,
    shift_type_id: data.shift_type_id || defaultShift.shift_type_id,
    employee_id: data.employee_id || defaultShift.employee_id,
    date_start: data.date_start || defaultShift.date_start,
    date_end: data.date_end || defaultShift.date_end,
    total_hours: data.total_hours || defaultShift.total_hours,
    weekday_code: data.weekday_code || defaultShift.weekday_code,
    comments: data.comments || defaultShift.comments,
    replacement_id: data.replacement_id || defaultShift.replacement_id,
    created_at: data.created_at || defaultShift.created_at,
    updated_at: data.updated_at || defaultShift.updated_at,
    status: data.status || defaultShift.status,
    date_start_employee: data.date_start_employee || defaultShift.date_start_employee,
    date_finish_employee: data.date_finish_employee || defaultShift.date_finish_employee,
    location_lat: data.location_lat !== null ? Number(data.location_lat) : defaultShift.location_lat,
    location_lng: data.location_lng !== null ? Number(data.location_lng) : defaultShift.location_lng,
    clock_on_lat: data.clock_on_lat !== null ? Number(data.clock_on_lat) : defaultShift.clock_on_lat,
    clock_on_lng: data.clock_on_lng !== null ? Number(data.clock_on_lng) : defaultShift.clock_on_lng,
    clock_off_lat: data.clock_off_lat !== null ? Number(data.clock_off_lat) : defaultShift.clock_off_lat,
    clock_off_lng: data.clock_off_lng !== null ? Number(data.clock_off_lng) : defaultShift.clock_off_lng,
    clock_on_time: data.clock_on_time || defaultShift.clock_on_time,
    clock_off_time: data.clock_off_time || defaultShift.clock_off_time,
    local_clock_on_time: data.local_clock_on_time || defaultShift.local_clock_on_time,
    local_clock_off_time: data.local_clock_off_time || defaultShift.local_clock_off_time,
    radius: data.radius !== null ? Number(data.radius) : defaultShift.radius,
    zoom: data.zoom !== null ? Number(data.zoom) : defaultShift.zoom,
    state: data.state !== undefined && data.state !== null ? Number(data.state) : defaultShift.state,
  };
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
  state?: ShiftState;
}

export interface ClockUpdateRequest {
  lat: number;
  lng: number;
  type: 'clock_on' | 'clock_off';
  state?: ShiftState;
}

