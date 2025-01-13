import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAbonoSavingComponent } from '../../../../shared/components/modals/savings/modal-abono-saving/modal-abono-saving.component';
import { ModalAddMemberGroupComponent } from '../../../../shared/components/modals/groups/modal-add-member-group/modal-add-member-group.component';

@Injectable({
  providedIn: 'root',
})
export class ModalAddMemberGroupService {
  constructor(private dialog: MatDialog) {}

  openModal(group: any): void {
    this.dialog.open(ModalAddMemberGroupComponent, {
      data: group,
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
