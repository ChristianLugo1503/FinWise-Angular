import { Injectable } from '@angular/core';
import { ModalNewGroupComponent } from '../../../../shared/components/modals/groups/modal-new-group/modal-new-group.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalNewGroupService {
  constructor(private dialog: MatDialog) {}

  openModal(): void {
    this.dialog.open(ModalNewGroupComponent, {});
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
