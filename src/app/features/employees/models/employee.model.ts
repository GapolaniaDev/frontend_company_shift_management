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

// Detailed employee response from GET /api/employees/{id}
export interface EmployeeDetail {
  id: number;
  company: {
    id: number;
    name: string;
  };
  supervisor: {
    id: number;
    name: string;
  } | null;
  user: {
    id: number;
    email: string;
    role: string;
    email_verified_at: string | null;
  } | null;
  summary: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    weekly_working_hours: number;
  };
  personal: {
    address: string;
    tax_number: string;
    abn: string;
    bsb: string;
    account: string;
  } | null;
  upcoming_shifts: UpcomingShift[];
  assignments: Assignment[];
  replacement_requests: ReplacementRequest[];
  replacement_bids: ReplacementBid[];
  clock_activity: {
    last_clock_on: ClockActivity | null;
    last_clock_off: ClockActivity | null;
  };
  audit: {
    last_session: {
      ip_address: string;
      user_agent: string;
      last_activity: string;
    } | null;
  } | null;
}

export interface UpcomingShift {
  id: number;
  date_start: string;
  date_end: string;
  total_hours: number;
  status: string;
  shift_type: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    name: string;
    address: string;
  } | null;
}

export interface Assignment {
  id: number;
  shift_id: number;
  status: string;
  assignment_type: string;
  assigned_at: string;
}

export interface ReplacementRequest {
  id: number;
  shift_assignment_id: number;
  status: string;
  reason: string;
  urgency: string;
  needed_by: string | null;
}

export interface ReplacementBid {
  id: number;
  replacement_request_id: number;
  status: string;
  bid_amount: number;
  message: string;
  bid_at: string;
}

export interface ClockActivity {
  time: string;
  lat: number;
  lng: number;
  timezone: string;
}

export interface EmployeeDetailResponse {
  success: boolean;
  data: EmployeeDetail;
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