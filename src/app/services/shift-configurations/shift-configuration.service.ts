import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {ApiService} from '@core/services/api.service'
import {
  ShiftConfiguration,
  ShiftConfigurationCreateRequest,
  ShiftConfigurationResponse,
  ShiftConfigurationUpdateRequest
} from "@features/shifts/models/shift-configuration.model";

@Injectable({
  providedIn: 'root'
})
export class ShiftConfigurationService {

  constructor(private apiService: ApiService) { }

  /**
   * Get all shift configurations with optional filters
   * @param employeeId Employee ID filter
   * @param shiftTypeId Shift type ID filter
   * @param page Page number
   * @param pageSize Items per page
   * @param sortBy Sort field
   * @param sortDir Sort direction
   * @returns Observable of the shift configuration response
   */
  getShiftConfigurations(
    employeeId?: number,
    shiftTypeId?: number,
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'id',
    sortDir: 'asc' | 'desc' = 'asc'
  ): Observable<ShiftConfigurationResponse> {
    const params = {
      employee_id: employeeId,
      shift_type_id: shiftTypeId,
      page,
      pageSize,
      sort_by: sortBy,
      sort_dir: sortDir
    };

    return this.apiService.get<ShiftConfigurationResponse>('shift-configurations', params);
  }

  /**
   * Create a new shift configuration
   * @param configData Shift configuration data
   * @returns Observable of the created shift configuration
   */
  createShiftConfiguration(configData: ShiftConfigurationCreateRequest): Observable<ShiftConfiguration> {
    return this.apiService.post<ShiftConfiguration>('shift-configurations', configData);
  }

  /**
   * Get shift configurations for the team supervised by the current user
   * @param employeeId Employee ID filter
   * @param shiftTypeId Shift type ID filter
   * @returns Observable of the shift configuration response
   */
  getTeamShiftConfigurations(
    employeeId?: number,
    shiftTypeId?: number
  ): Observable<ShiftConfigurationResponse> {
    const params = {
      employee_id: employeeId,
      shift_type_id: shiftTypeId
    };

    return this.apiService.get<ShiftConfigurationResponse>('shift-configurations/team', params);
  }

  /**
   * Get shift configurations for the current authenticated employee
   * @param shiftTypeId Shift type ID filter
   * @returns Observable of the shift configuration response
   */
  getMyShiftConfigurations(shiftTypeId?: number): Observable<ShiftConfigurationResponse> {
    const params = {
      shift_type_id: shiftTypeId
    };

    return this.apiService.get<ShiftConfigurationResponse>('shift-configurations/my-configurations', params);
  }

  /**
   * Get a shift configuration by ID
   * @param id Shift configuration ID
   * @returns Observable of the shift configuration
   */
  getShiftConfigurationById(id: number): Observable<ShiftConfiguration> {
    return this.apiService.get<ShiftConfiguration>(`shift-configurations/${id}`);
  }

  /**
   * Update a shift configuration
   * @param id Shift configuration ID
   * @param configData Updated shift configuration data
   * @returns Observable of the updated shift configuration
   */
  updateShiftConfiguration(id: number, configData: ShiftConfigurationUpdateRequest): Observable<ShiftConfiguration> {
    return this.apiService.put<ShiftConfiguration>(`shift-configurations/${id}`, configData);
  }

  /**
   * Delete a shift configuration
   * @param id Shift configuration ID
   * @returns Observable of the deletion response
   */
  deleteShiftConfiguration(id: number): Observable<any> {
    return this.apiService.delete<any>(`shift-configurations/${id}`);
  }
}
