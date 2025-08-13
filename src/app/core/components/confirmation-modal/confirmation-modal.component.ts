import {Component, OnInit, OnDestroy} from '@angular/core'
import {CommonModule, NgIf} from '@angular/common'
import {Subscription} from 'rxjs'
import {ConfirmationModalService} from "@core/services/confirmation-modal/confirmation-modal.service";


@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent {
  message = '';
  isVisible = false;
  private confirmCallback?: () => void;
  private cancelCallback?: () => void;
  private subscription?: Subscription;

  constructor(private modalService: ConfirmationModalService) {
  }

  ngOnInit(): void {
    this.subscription = this.modalService.confirm$.subscribe(({message, confirm, cancel}) => {
      this.message = message;
      this.isVisible = true;
      this.confirmCallback = confirm;
      this.cancelCallback = cancel;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onConfirm(): void {
    this.isVisible = false;
    this.confirmCallback?.();
    this.reset();
  }

  onCancel(): void {
    this.isVisible = false;
    this.cancelCallback?.();
    this.reset();
  }

  private reset(): void {
    this.message = '';
    this.confirmCallback = undefined;
    this.cancelCallback = undefined;
  }


}
