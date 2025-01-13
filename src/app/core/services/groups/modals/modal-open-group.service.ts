import { Injectable } from '@angular/core';
import { ModalOpenGroupComponent } from '../../../../shared/components/modals/groups/modal-open-group/modal-open-group.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalOpenGroupService {
  constructor(private dialog: MatDialog) {}

  openModal(group: any): void {
    this.dialog.open(ModalOpenGroupComponent, {
      data: group,
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
