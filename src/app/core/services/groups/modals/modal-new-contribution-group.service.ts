import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalNewContributionGroupComponent } from '../../../../shared/components/modals/groups/modal-new-contribution-group/modal-new-contribution-group.component';

@Injectable({
  providedIn: 'root',
})
export class ModalNewContributionGroupService {
  constructor(private dialog: MatDialog) {}

  openModal(group: any): void {
    this.dialog.open(ModalNewContributionGroupComponent, {
      data: group,
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
