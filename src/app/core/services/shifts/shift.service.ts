import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { ApiService } from '@core/services/api.service'
import { 
  ClockUpdateRequest, 
  Shift, 
  ShiftCreateRequest, 
  ShiftResponse, 
  ShiftUpdateRequest 
} from "@features/shifts/models/shift";

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  constructor(private apiService: ApiService) { }

  /**
   * Get all shifts with optional filters
   * @param dateFrom Start date filter
   * @param dateTo End date filter
   * @param shiftTypeId Shift type ID filter
   * @param page Page number
   * @param perPage Items per page
   * @param sortBy Sort field
   * @param sortDir Sort direction
   * @returns Observable of the shift response
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
    const params = {
      date_from: dateFrom,
      date_to: dateTo,
      shift_type_id: shiftTypeId,
      page,
      per_page: perPage,
      sort_by: sortBy,
      sort_dir: sortDir
    };

    return this.apiService.get<ShiftResponse>('shifts', params);
  }

  /**
   * Create a new shift
   * @param shiftData Shift data
   * @returns Observable of the created shift
   */
  createShift(shiftData: ShiftCreateRequest): Observable<Shift> {
    return this.apiService.post<Shift>('shifts', shiftData);
  }

  /**
   * Get shifts for the current authenticated employee
   * @param dateFrom Start date filter
   * @param dateTo End date filter
   * @param shiftTypeId Shift type ID filter
   * @param page Page number
   * @param perPage Items per page
   * @returns Observable of the shift response
   */
  getMyShifts(
    dateFrom?: string,
    dateTo?: string,
    shiftTypeId?: number,
    page: number = 1,
    perPage: number = 10
  ): Observable<ShiftResponse> {
    const params = {
      date_from: dateFrom,
      date_to: dateTo,
      shift_type_id: shiftTypeId,
      page,
      per_page: perPage
    };

    return this.apiService.get<ShiftResponse>('shifts/my-shifts', params);
  }

  /**
   * Get shifts for the team supervised by the current user
   * @returns Observable of the shift response
   */
  getTeamShifts(): Observable<ShiftResponse> {
    return this.apiService.get<ShiftResponse>('shifts/team');
  }

  /**
   * Get a shift by ID
   * @param id Shift ID
   * @returns Observable of the shift
   */
  getShiftById(id: number): Observable<Shift> {
    return this.apiService.get<Shift>(`shifts/${id}`);
  }

  /**
   * Update a shift
   * @param id Shift ID
   * @param shiftData Updated shift data
   * @returns Observable of the updated shift
   */
  updateShift(id: number, shiftData: ShiftUpdateRequest): Observable<Shift> {
    return this.apiService.put<Shift>(`shifts/${id}`, shiftData);
  }

  /**
   * Delete a shift
   * @param id Shift ID
   * @returns Observable of the deletion response
   */
  deleteShift(id: number): Observable<any> {
    return this.apiService.delete<any>(`shifts/${id}`);
  }

  /**
   * Get the current shift for today
   * @returns Observable of the current shift
   */
  getTodayShift(): Observable<Shift> {
    return this.apiService.get<Shift>('shifts/today');
  }

  /**
   * Update clock-in or clock-out for a shift
   * @param id Shift ID
   * @param clockData Clock update data
   * @returns Observable of the updated shift
   */
  updateClock(id: number, clockData: ClockUpdateRequest): Observable<Shift> {
    return this.apiService.put<Shift>(`shifts/${id}/update-clock`, clockData);
  }

  /**
   * Generate shifts for the next fortnight
   * @returns Observable of the generation response
   */
  generateNextFortnightShifts(): Observable<any> {
    return this.apiService.get<any>('generate-next-fortnight-shifts');
  }
}
