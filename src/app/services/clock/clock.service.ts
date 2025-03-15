import {Injectable} from '@angular/core';

interface TimerData {
  hours: string;
  minutes: string;
  seconds: string;
  period?: string;
  currentDate?: string;
}

@Injectable({providedIn: 'root'})
export class ClockService {
  private timerInterval: any = null;
  private lastStartTime: number | null = null;
  private isRunning = false;

  /**
   * Start the clock or timer
   * @param isShiftActive If true, runs in timer mode counting elapsed time from startTime
   * @param startTime The timestamp when the shift started (in milliseconds)
   * @param callback Function to be called with the updated time data
   */
  startClock(
    isShiftActive: boolean,
    startTime: number | null,
    callback: (time: TimerData) => void
  ): void {
    // Stop any existing timer first
    this.stopClock();
    
    // Ensure we have a valid start time
    if (!startTime) {
      startTime = Date.now();
    }
    
    // Store the start time so we can restart the timer if needed
    this.lastStartTime = startTime;
    this.isRunning = true;
    
    // Log detailed information about the timer start
    console.log('Starting clock with startTime:', new Date(this.lastStartTime).toISOString());
    console.log('Current time:', new Date().toISOString());
    console.log('Elapsed time at start (ms):', Date.now() - this.lastStartTime);

    // Calculate and immediately show initial time without waiting for the first interval
    this.calculateAndSendTime(isShiftActive, startTime, callback);
    
    // Set up the interval to update time every second
    this.timerInterval = setInterval(() => {
      this.calculateAndSendTime(isShiftActive, startTime, callback);
    }, 1000);
  }
  
  /**
   * Calculate the current time or elapsed time and send it via callback
   */
  private calculateAndSendTime(
    isShiftActive: boolean, 
    startTime: number,
    callback: (time: TimerData) => void
  ): void {
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!isShiftActive) {
      // Normal clock mode - just show current time
      const hours = now.getHours();
      const period = hours >= 12 ? 'PM' : 'AM';

      callback({
        hours: this.padZero(hours % 12 || 12),
        minutes: this.padZero(now.getMinutes()),
        seconds: this.padZero(now.getSeconds()),
        period,
        currentDate,
      });
    } else {
      // Timer mode - calculate elapsed time since shift started
      const currentTime = Date.now();
      
      // startTime contains the timestamp when the shift started (clock_on_time)
      const elapsedMs = currentTime - startTime;
      
      // Log diagnostic info but only occasionally to avoid console flood
      if (elapsedMs % 30000 < 1000) { // Log every 30 seconds roughly
        console.log(`Timer diagnostic - Current: ${new Date(currentTime).toISOString()}, Start: ${new Date(startTime).toISOString()}, Elapsed: ${elapsedMs}ms`);
      }
      
      // Convert elapsed milliseconds to hours, minutes, seconds
      const totalSeconds = Math.floor(elapsedMs / 1000);
      const cronoHours = Math.floor(totalSeconds / 3600);
      const cronoMinutes = Math.floor((totalSeconds % 3600) / 60);
      const cronoSeconds = totalSeconds % 60;
      const period = now.getHours() >= 12 ? 'PM' : 'AM';

      callback({
        hours: this.padZero(cronoHours),
        minutes: this.padZero(cronoMinutes),
        seconds: this.padZero(cronoSeconds),
        period,
        currentDate,
      });
    }
  }

  /**
   * Stop the current timer
   */
  stopClock(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.isRunning = false;
    }
  }
  
  /**
   * Check if the timer is currently running
   */
  isTimerRunning(): boolean {
    return this.isRunning;
  }
  
  /**
   * Get the last start time used for the timer
   */
  getLastStartTime(): number | null {
    return this.lastStartTime;
  }

  /**
   * Add leading zero to numbers less than 10
   */
  private padZero(num: number): string {
    return num < 10 ? '0' + num : String(num);
  }
}