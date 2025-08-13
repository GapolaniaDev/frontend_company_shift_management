import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiService } from '@core/services/api.service'
import { 
  ShiftType, 
  ShiftTypeCreateRequest, 
  ShiftTypeResponse, 
  ShiftTypeUpdateRequest 
} from "@features/shifts/models/shift-type.model"

@Injectable({
  providedIn: 'root'
})
export class ShiftTypeService {

  constructor(private apiService: ApiService) { }

  /**
   * Get all shift types with optional filters
   * @param page Page number
   * @param perPage Items per page
   * @param sortBy Sort field
   * @param sortDir Sort direction
   * @returns Observable of the shift type response
   */
  getShiftTypes(
    page: number = 1,
    perPage: number = 10,
    sortBy: string = 'id',
    sortDir: 'asc' | 'desc' = 'asc'
  ): Observable<ShiftTypeResponse> {
    const params = {
      page,
      per_page: perPage,
      sort_by: sortBy,
      sort_dir: sortDir
    };

    return this.apiService.get<ShiftTypeResponse>('shift-types', params);
  }

  /**
   * Create a new shift type
   * @param shiftTypeData Shift type data
   * @returns Observable of the created shift type
   */
  createShiftType(shiftTypeData: ShiftTypeCreateRequest): Observable<ShiftType> {
    return this.apiService.post<ShiftType>('shift-types', shiftTypeData);
  }

  /**
   * Get a shift type by ID
   * @param id Shift type ID
   * @returns Observable of the shift type
   */
  getShiftTypeById(id: number): Observable<ShiftType> {
    return this.apiService.get<ShiftType>(`shift-types/${id}`);
  }

  /**
   * Update a shift type
   * @param id Shift type ID
   * @param shiftTypeData Updated shift type data
   * @returns Observable of the updated shift type
   */
  updateShiftType(id: number, shiftTypeData: ShiftTypeUpdateRequest): Observable<ShiftType> {
    return this.apiService.put<ShiftType>(`shift-types/${id}`, shiftTypeData);
  }

  /**
   * Delete a shift type
   * @param id Shift type ID
   * @returns Observable of the deletion response
   */
  deleteShiftType(id: number): Observable<any> {
    return this.apiService.delete<any>(`shift-types/${id}`);
  }
}
