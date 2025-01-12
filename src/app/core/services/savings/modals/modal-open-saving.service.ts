import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalOpenSavingComponent } from '../../../../shared/components/modals/savings/modal-open-saving/modal-open-saving.component';

@Injectable({
  providedIn: 'root',
})
export class ModalOpenSavingService {
  constructor(private dialog: MatDialog) {}

  openModal(saving: any): void {
    this.dialog.open(ModalOpenSavingComponent, {
      data: saving,
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
