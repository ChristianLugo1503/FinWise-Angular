import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAbonoSavingComponent } from '../../../../shared/components/modals/savings/modal-abono-saving/modal-abono-saving.component';

@Injectable({
  providedIn: 'root',
})
export class ModalAbonoSavingService {
  constructor(private dialog: MatDialog) {}

  openModal(saving: any): void {
    this.dialog.open(ModalAbonoSavingComponent, {
      data: saving,
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
