import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false); // Default to light mode
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  // Update the dark mode value
  setDarkMode(isDark: boolean) {
    this.isDarkModeSubject.next(isDark);
  }

  // Get the current dark mode value
  getDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
}
