import {inject, Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {
  AssignSupervisorRequest,
  Employee,
  EmployeeCreateRequest,
  EmployeeResponse,
  EmployeeUpdateRequest,
  EmployeeDetailResponse
} from '@features/employees/models/employee.model';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/employees`;

  /**
   * Get all employees with optional filters
   */
  getEmployees(
    search?: string,
    supervisorId?: number,
    page: number = 1,
    perPage: number = 10,
    sortBy: string = 'id',
    sortDir: 'asc' | 'desc' = 'asc'
  ): Observable<EmployeeResponse> {
    const params: any = {
      page,
      per_page: perPage,
      sort_by: sortBy,
      sort_dir: sortDir
    };

    if (search) params.search = search;
    if (supervisorId) params.supervisor_id = supervisorId;

    return this.http.get<EmployeeResponse>(this.baseUrl, { params });
  }

  /**
   * Create a new employee
   */
  createEmployee(employeeData: EmployeeCreateRequest): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employeeData);
  }

  /**
   * Get employees supervised by the current user
   */
  getSupervisees(page: number = 1, perPage: number = 10): Observable<EmployeeResponse> {
    const params = {
      page,
      per_page: perPage
    };

    return this.http.get<EmployeeResponse>(`${this.baseUrl}/supervisees`, { params });
  }

  /**
   * Get an employee by ID (simple version)
   */
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get detailed employee profile
   */
  getEmployeeDetail(id: number): Observable<EmployeeDetailResponse> {
    return this.http.get<EmployeeDetailResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Update an employee
   */
  updateEmployee(id: number, employeeData: EmployeeUpdateRequest): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, employeeData);
  }

  /**
   * Delete an employee
   */
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get the current authenticated employee
   */
  getCurrentEmployee(): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/me`);
  }

  /**
   * Assign a supervisor to an employee
   */
  assignSupervisor(employeeId: number, supervisorId: number): Observable<any> {
    const data: AssignSupervisorRequest = { supervisor_id: supervisorId };
    return this.http.post<any>(`${this.baseUrl}/${employeeId}/assign-supervisor`, data);
  }
}
