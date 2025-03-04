import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ClockService {
  private timerInterval: any = null;

  startClock(
    isShiftActive: boolean,
    startTime: number | null,
    callback: (
      time: {
        hours: string;
        minutes: string;
        seconds: string;
        period?: string;
        currentDate?: string;
      }
    ) => void
  ): void {
    if (!startTime) {
      startTime = Date.now();
    }

    this.timerInterval = setInterval(() => {
      const now = new Date();
      const currentDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!isShiftActive) {
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
        const elapsedMs = Date.now() - (startTime || 0);
        const totalSeconds = Math.floor(elapsedMs / 1000);
        const cronoHours = Math.floor(totalSeconds / 3600);
        const cronoMinutes = Math.floor((totalSeconds % 3600) / 60);
        const cronoSeconds = totalSeconds % 60;
        const period = now.getHours() >= 12 ? 'PM' : 'AM'; // Calculamos el periodo en modo cronómetro

        callback({
          hours: this.padZero(cronoHours),
          minutes: this.padZero(cronoMinutes),
          seconds: this.padZero(cronoSeconds),
          period,
          currentDate,
        });
      }
    }, 1000);
  }

  stopClock(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : String(num);
  }
}
