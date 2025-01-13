import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalViewContributionsComponent } from '../../../../shared/components/modals/groups/modal-view-contributions/modal-view-contributions.component';
import { ModalViewUserContributionsComponent } from '../../../../shared/components/modals/groups/modal-view-user-contributions/modal-view-user-contributions.component';

@Injectable({
  providedIn: 'root',
})
export class ModalViewUserContributionsService {
  constructor(private dialog: MatDialog) {}

  openModal(group: any, memberId: number): void {
    this.dialog.open(ModalViewUserContributionsComponent, {
      data: { group, memberId },
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
