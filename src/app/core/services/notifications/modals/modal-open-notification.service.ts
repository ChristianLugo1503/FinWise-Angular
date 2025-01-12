import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditSavingComponent } from '../../../../shared/components/modals/savings/modal-edit-saving/modal-edit-saving.component';
import { ModalOpenNotificationComponent } from '../../../../shared/components/modals/notifications/modal-open-notification/modal-open-notification.component';

@Injectable({
  providedIn: 'root',
})
export class ModalOpenNotificationService {
  constructor(private dialog: MatDialog) {}

  openModal(notification: any): void {
    this.dialog.open(ModalOpenNotificationComponent, {
      data: notification,
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
