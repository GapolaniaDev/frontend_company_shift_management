import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationModalService {
  private confirmSubject = new Subject<{ message: string; confirm: () => void; cancel?: () => void }>();
  confirm$ = this.confirmSubject.asObservable();

  open(message: string, confirmCallback: () => void, cancelCallback?: () => void): void {
    this.confirmSubject.next({ message, confirm: confirmCallback, cancel: cancelCallback });
  }
}
