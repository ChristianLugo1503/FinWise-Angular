import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddPaymentComponent } from '../../../../shared/components/modals/recurring-payments/modal-add-payment/modal-add-payment.component';
import { ModalEditPaymentComponent } from '../../../../shared/components/modals/recurring-payments/modal-edit-payment/modal-edit-payment.component';

@Injectable({
  providedIn: 'root',
})
export class ModalEditPaymentService {
  constructor(private dialog: MatDialog) {}

  openModal(payment: String): void {
    this.dialog.open(ModalEditPaymentComponent, {
      data: payment,
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
