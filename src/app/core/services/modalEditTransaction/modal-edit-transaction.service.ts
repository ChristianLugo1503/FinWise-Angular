import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditTransactionComponent } from '../../../shared/components/modales/modal-edit-transaction/modal-edit-transaction.component';

@Injectable({
  providedIn: 'root'
})
export class ModalEditTransactionService {
  constructor(private dialog: MatDialog) {}

  openModal(transaction: any): void {
    this.dialog.open(ModalEditTransactionComponent, {
      data: {
        transaction: transaction
      }
    });
  }

  closeModal(): void {
    this.dialog.closeAll(); 
  }
}
