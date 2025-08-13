import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { 
  ClockUpdateRequest, 
  Shift, 
  ShiftCreateRequest, 
  ShiftResponse, 
  ShiftUpdateRequest 
} from '../models/shift';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/shifts`;

  /**
   * Get all shifts with optional filters
   */
  getShifts(
    dateFrom?: string,
    dateTo?: string,
    shiftTypeId?: number,
    page: number = 1,
    perPage: number = 10,
    sortBy: string = 'date_start',
    sortDir: 'asc' | 'desc' = 'asc'
  ): Observable<ShiftResponse> {
    const params: any = {
      page,
      per_page: perPage,
      sort_by: sortBy,
      sort_dir: sortDir
    };

    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    if (shiftTypeId) params.shift_type_id = shiftTypeId;

    return this.http.get<ShiftResponse>(this.baseUrl, { params });
  }

  /**
   * Create a new shift
   */
  createShift(shiftData: ShiftCreateRequest): Observable<Shift> {
    return this.http.post<Shift>(this.baseUrl, shiftData);
  }

  /**
   * Get shifts for the current authenticated employee
   */
  getMyShifts(
    dateFrom?: string,
    dateTo?: string,
    shiftTypeId?: number,
    page: number = 1,
    perPage: number = 10
  ): Observable<ShiftResponse> {
    const params: any = {
      page,
      per_page: perPage
    };

    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    if (shiftTypeId) params.shift_type_id = shiftTypeId;

    return this.http.get<ShiftResponse>(`${this.baseUrl}/my-shifts`, { params });
  }

  /**
   * Get shifts for today
   */
  getShiftsToday(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/today`);
  }

  /**
   * Get shifts for the team supervised by the current user
   */
  getTeamShifts(): Observable<ShiftResponse> {
    return this.http.get<ShiftResponse>(`${this.baseUrl}/team`);
  }

  /**
   * Get a shift by ID
   */
  getShiftById(id: number): Observable<Shift> {
    return this.http.get<Shift>(`${this.baseUrl}/${id}`);
  }

  /**
   * Update a shift
   */
  updateShift(id: number, shiftData: ShiftUpdateRequest): Observable<Shift> {
    return this.http.put<Shift>(`${this.baseUrl}/${id}`, shiftData);
  }

  /**
   * Delete a shift
   */
  deleteShift(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get the current shift for today
   */
  getTodayShift(): Observable<Shift> {
    return this.http.get<Shift>(`${this.baseUrl}/today`);
  }

  /**
   * Update clock-in or clock-out for a shift with timezone information
   */
  updateClock(id: number, clockData: ClockUpdateRequest): Observable<Shift> {
    return this.http.put<Shift>(`${this.baseUrl}/${id}/update-clock`, clockData);
  }

  /**
   * Update clock position with timezone information (legacy method, consolidated)
   */
  updateClockPosition(
    shiftId: number, 
    lat: number, 
    lng: number, 
    type: 'clock_on' | 'clock_off',
    timezone?: string
  ): Observable<any> {
    const state = type === 'clock_on' ? 1 : 2;
    const localTime = new Date().toISOString();
    
    const body = {
      lat, 
      lng, 
      type, 
      state,
      timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      local_time: localTime
    };
    
    return this.http.put<any>(`${this.baseUrl}/${shiftId}/update-clock`, body);
  }

  /**
   * Generate shifts for the next fortnight
   */
  generateNextFortnightShifts(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/generate-next-fortnight-shifts`);
  }
}