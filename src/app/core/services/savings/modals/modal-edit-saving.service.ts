import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditSavingComponent } from '../../../../shared/components/modals/savings/modal-edit-saving/modal-edit-saving.component';

@Injectable({
  providedIn: 'root',
})
export class ModalEditSavingService {
  constructor(private dialog: MatDialog) {}

  openModal(saving: any): void {
    this.dialog.open(ModalEditSavingComponent, {
      data: saving,
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
