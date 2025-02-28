import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {observableToBeFn} from "rxjs/internal/testing/TestScheduler";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getShiftsToday(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/shifts/today`);
  }

  updateClockPosition(shiftId: number, lat: number, lng: number, type: 'clock_on' | 'clock_off'): Observable<any> {
    const url = `${this.apiUrl}/shifts/${shiftId}/update-clock`;
    const body = {lat, lng, type};
    return this.http.put<any>(url, body);
  }


}
