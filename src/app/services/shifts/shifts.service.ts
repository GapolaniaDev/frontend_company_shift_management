import {Injectable} from '@angular/core'
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TimezoneService} from "@core/services/timezone/timezone.service";

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private timezoneService: TimezoneService
  ) {}

  getShiftsToday(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/shifts/today`);
  }

  /**
   * Update clock position with timezone information
   * @param shiftId The ID of the shift to update
   * @param lat Latitude
   * @param lng Longitude
   * @param type Clock action type (clock_on or clock_off)
   * @returns Observable of the API response
   */
  updateClockPosition(shiftId: number, lat: number, lng: number, type: 'clock_on' | 'clock_off'): Observable<any> {
    const url = `${this.apiUrl}/shifts/${shiftId}/update-clock`;
    const state = type === 'clock_on' ? 1 : 2; // 1 = started, 2 = finished
    const timezone = this.timezoneService.getTimezone();

    // Include timezone in the request payload
    // Include local_time (current user's time) to help with local_clock_on_time/local_clock_off_time
    const localTime = new Date().toISOString();

    const body = {
      lat,
      lng,
      type,
      state,
      timezone, // Add the timezone to the request
      local_time: localTime // Send current local time to help server calculate local_clock_on_time
    };

    console.log(`Sending clock update with timezone: ${timezone}, local time: ${localTime}`);
    return this.http.put<any>(url, body);
  }
}
