import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddSavingComponent } from '../../../../shared/components/modals/savings/modal-add-saving/modal-add-saving.component';

@Injectable({
  providedIn: 'root',
})
export class ModalAddSavingService {
  constructor(private dialog: MatDialog) {}

  openModal(): void {
    this.dialog.open(ModalAddSavingComponent, {});
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
