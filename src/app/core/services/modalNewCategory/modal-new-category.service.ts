import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalNewCategoryComponent } from '../../../shared/components/modales/modal-new-category/modal-new-category.component';

@Injectable({
  providedIn: 'root'
})
export class ModalNewCategoryService {
  constructor(private dialog: MatDialog) {}

  openModal(): void {
    this.dialog.open(ModalNewCategoryComponent, {
      data: {
      }
    });
  }

  closeModal(): void {
    this.dialog.closeAll(); 
  }
}
