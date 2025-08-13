export interface ShiftType {
  id: number;
  name: string;
  description?: string;
  weekly_hours: number;
  schedule?: any; // Could be structured further depending on the schedule format
  created_at: string;
  updated_at: string;
}

export interface ShiftTypeResponse {
  data: ShiftType[];
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

export interface ShiftTypeCreateRequest {
  name: string;
  description?: string;
  weekly_hours: number;
  schedule?: any;
}

export interface ShiftTypeUpdateRequest {
  name?: string;
  description?: string;
  weekly_hours?: number;
  schedule?: any;
}