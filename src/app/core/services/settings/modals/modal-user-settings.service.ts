import { Injectable } from '@angular/core';
import { ModalUserSettingsComponent } from '../../../../shared/components/modals/settings/modal-user-settings/modal-user-settings.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalUserSettingsService {
  constructor(private dialog: MatDialog) {}

  openModal(): void {
    this.dialog.open(ModalUserSettingsComponent, {});
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
