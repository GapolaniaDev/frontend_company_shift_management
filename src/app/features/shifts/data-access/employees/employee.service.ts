import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiService } from '@core/services/api.service'
import { 
  AssignSupervisorRequest, 
  Employee, 
  EmployeeCreateRequest, 
  EmployeeResponse, 
  EmployeeUpdateRequest 
} from '../../models/employee.model

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private apiService: ApiService) { }

  /**
   * Get all employees with optional filters
   * @param search Search term
   * @param supervisorId Filter by supervisor ID
   * @param page Page number
   * @param perPage Items per page
   * @param sortBy Sort field
   * @param sortDir Sort direction
   * @returns Observable of the employee response
   */
  getEmployees(
    search?: string,
    supervisorId?: number,
    page: number = 1,
    perPage: number = 10,
    sortBy: string = 'id',
    sortDir: 'asc' | 'desc' = 'asc'
  ): Observable<EmployeeResponse> {
    const params = {
      search,
      supervisor_id: supervisorId,
      page,
      per_page: perPage,
      sort_by: sortBy,
      sort_dir: sortDir
    };

    return this.apiService.get<EmployeeResponse>('employees', params);
  }

  /**
   * Create a new employee
   * @param employeeData Employee data
   * @returns Observable of the created employee
   */
  createEmployee(employeeData: EmployeeCreateRequest): Observable<Employee> {
    return this.apiService.post<Employee>('employees', employeeData);
  }

  /**
   * Get employees supervised by the current user
   * @param page Page number
   * @param perPage Items per page
   * @returns Observable of the supervisee response
   */
  getSupervisees(page: number = 1, perPage: number = 10): Observable<EmployeeResponse> {
    const params = {
      page,
      per_page: perPage
    };

    return this.apiService.get<EmployeeResponse>('employees/supervisees', params);
  }

  /**
   * Get an employee by ID
   * @param id Employee ID
   * @returns Observable of the employee
   */
  getEmployeeById(id: number): Observable<Employee> {
    return this.apiService.get<Employee>(`employees/${id}`);
  }

  /**
   * Update an employee
   * @param id Employee ID
   * @param employeeData Updated employee data
   * @returns Observable of the updated employee
   */
  updateEmployee(id: number, employeeData: EmployeeUpdateRequest): Observable<Employee> {
    return this.apiService.put<Employee>(`employees/${id}`, employeeData);
  }

  /**
   * Delete an employee
   * @param id Employee ID
   * @returns Observable of the deletion response
   */
  deleteEmployee(id: number): Observable<any> {
    return this.apiService.delete<any>(`employees/${id}`);
  }

  /**
   * Get the current authenticated employee
   * @returns Observable of the current employee
   */
  getCurrentEmployee(): Observable<Employee> {
    return this.apiService.get<Employee>('employees/me');
  }

  /**
   * Assign a supervisor to an employee
   * @param employeeId Employee ID
   * @param supervisorId Supervisor ID
   * @returns Observable of the assignment response
   */
  assignSupervisor(employeeId: number, supervisorId: number): Observable<any> {
    const data: AssignSupervisorRequest = { supervisor_id: supervisorId };
    return this.apiService.post<any>(`employees/${employeeId}/assign-supervisor`, data);
  }
}
