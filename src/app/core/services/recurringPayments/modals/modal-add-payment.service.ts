import { Injectable } from '@angular/core';
import { ModalAddPaymentComponent } from '../../../../shared/components/modals/recurring-payments/modal-add-payment/modal-add-payment.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalAddPaymentService {
  constructor(private dialog: MatDialog) {}

  openModal(type: String): void {
    this.dialog.open(ModalAddPaymentComponent, {
      data: {
        type: type,
      },
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
