import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {
  private static readonly DEFAULT_TIMEZONE = 'UTC'
  
  // BehaviorSubject to handle the timezone reactively
  private timezoneSubject = new BehaviorSubject<string>(TimezoneService.DEFAULT_TIMEZONE);

  // Observable to subscribe to timezone changes
  public timezone$: Observable<string> = this.timezoneSubject.asObservable();

  constructor() {
    // Initialize the timezone on service creation
    this.initializeTimezone();
  }

  /**
   * Initialize the timezone from the browser
   * Uses Intl.DateTimeFormat to get the user's timezone, with UTC as fallback
   */
  private initializeTimezone(): void {
    console.log('initializing timezone', TimezoneService.DEFAULT_TIMEZONE);
    try {
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (browserTimezone && browserTimezone.trim() !== '') {
        this.timezoneSubject.next(browserTimezone);
        console.log('Timezone initialized:', browserTimezone);
      } else {
        this.timezoneSubject.next(TimezoneService.DEFAULT_TIMEZONE);
        console.warn('Browser timezone not available, using default:', TimezoneService.DEFAULT_TIMEZONE);
      }
    } catch (error) {
      console.error('Error detecting timezone, using default:', error);
      this.timezoneSubject.next(TimezoneService.DEFAULT_TIMEZONE);
    }
  }

  /**
   * Get the current timezone value
   * @returns The current timezone string
   */
  getTimezone(): string {
    return this.timezoneSubject.getValue();
  }

  /**
   * Set a new timezone value
   * @param timezone The new timezone to set
   */
  setTimezone(timezone: string): void {
    if (timezone && timezone.trim() !== '') {
      this.timezoneSubject.next(timezone);
      console.log('Timezone updated:', timezone);
    } else {
      console.warn('Invalid timezone provided, not updating');
    }
  }

  /**
   * Reset the timezone to the browser's default
   */
  resetToSystemTimezone(): void {
    this.initializeTimezone();
  }
}
