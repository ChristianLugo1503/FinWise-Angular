import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalViewContributionsComponent } from '../../../../shared/components/modals/groups/modal-view-contributions/modal-view-contributions.component';

@Injectable({
  providedIn: 'root',
})
export class ModalViewContributionsService {
  constructor(private dialog: MatDialog) {}

  openModal(group: any): void {
    this.dialog.open(ModalViewContributionsComponent, {
      data: group,
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }
}
