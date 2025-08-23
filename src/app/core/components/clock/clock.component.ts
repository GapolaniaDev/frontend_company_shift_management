import {Component, OnDestroy, OnInit} from '@angular/core'
import {SharedNgIconsModule} from "../../../shared/ng-icons.module";
import {NgIf} from "@angular/common";
import {ClockService} from "@core/services/clock/clock.service";
import {ShiftStateService} from '../../../services/shift-state/shift-state.service'
import {Subscription} from 'rxjs'
import {ShiftState} from "@features/shifts/models/shift";

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [SharedNgIconsModule, NgIf],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css'
})
export class ClockComponent implements OnInit, OnDestroy {
  isShiftActive = false;
  isClockReady = false;
  shiftState: ShiftState = ShiftState.NOT_STARTED;

  clockData: {
    hours: string;
    minutes: string;
    seconds: string;
    period?: string;
    currentDate?: string;
  } = {
    hours: '00',
    minutes: '00',
    seconds: '00',
    period: '',
    currentDate: ''
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private clockService: ClockService,
    private shiftStateService: ShiftStateService
  ) {}

  ngOnInit(): void {
    // First, always refresh the shift data to make sure we have the latest info
    this.refreshShiftData();

    // Subscribe to shift state changes
    this.subscriptions.push(
      this.shiftStateService.shiftState$.subscribe((state) => {
        console.log('Shift state changed:', state);
        this.shiftState = state;

        // For backward compatibility, update isShiftActive
        this.isShiftActive = state === ShiftState.STARTED;

        if (state === ShiftState.STARTED) {
          this.startOrRefreshTimer();
        } else {
          this.isClockReady = false;
          if (state === ShiftState.FINISHED) {
            this.clockService.stopClock();
          }
        }
      })
    );

    // For backward compatibility, still subscribe to isShiftActive
    this.subscriptions.push(
      this.shiftStateService.isShiftActive$.subscribe((isActive) => {
        console.log('Shift active state changed:', isActive);
        this.isShiftActive = isActive;

        if (isActive) {
          this.startOrRefreshTimer();
        }
      })
    );
  }

  /**
   * Refresh shift data from the server
   */
  private refreshShiftData(): void {
    // Use the shared service to fetch the latest data about shifts
    // This ensures we have the most up-to-date information, especially after page refresh
    this.shiftStateService.fetchShiftsToday(
      () => console.log('Fetching shift data...'),
      () => console.log('Shift data fetched')
    );
  }

  /**
   * Start or refresh the timer based on the clock-on time from the backend
   */
  private startOrRefreshTimer(): void {
    // Stop any existing clock timer before starting a new one
    this.clockService.stopClock();

    // Primero obtenemos el turno actual completo para acceder a todos sus datos
    const currentShift = this.shiftStateService.getCurrentShift().shift;
    console.log('Current shift data:', currentShift);

    // Si el turno está activo (estado = STARTED), debemos mostrar un reloj
    if (currentShift && this.shiftState === ShiftState.STARTED) {
      this.shiftStateService.getClockOnTime()
        .subscribe((clockOnTime) => {
          console.log('Clock on time from server:', clockOnTime);

          let startTimestamp: number;

          // Si no tenemos clock_on_time, pero el estado es STARTED, creamos un timestamp actual
          if (!clockOnTime) {
            console.warn('No clock-on time available, using current time instead');
            // Usamos la hora actual como fallback
            startTimestamp = Date.now();
          } else {
            try {
              // Parse the date from the server
              startTimestamp = new Date(clockOnTime).getTime();

              // Validate that we have a valid timestamp
              if (isNaN(startTimestamp) || startTimestamp <= 0) {
                console.warn('Invalid start time:', clockOnTime, 'using current time instead');
                startTimestamp = Date.now();
              }
            } catch (error) {
              console.warn('Error parsing clock-on time, using current time instead:', error);
              startTimestamp = Date.now();
            }
          }

          console.log('Using start timestamp:', new Date(startTimestamp).toISOString());
          console.log('Current time:', new Date().toISOString());
          console.log('Elapsed time (ms):', Date.now() - startTimestamp);

          // Start the timer with the timestamp (either from server or fallback)
          this.clockService.startClock(true, startTimestamp, (time) => {
            this.clockData = time;
            // Set isClockReady to true so the timer is displayed
            this.isClockReady = true;
          });
        });
    } else {
      console.log('Shift is not active, not starting timer');
      this.isClockReady = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.clockService.stopClock();
  }
}
