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
}
