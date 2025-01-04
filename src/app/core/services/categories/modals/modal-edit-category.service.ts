import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditCategoryComponent } from '../../../../shared/components/modals/categories/modal-edit-category/modal-edit-category.component';

@Injectable({
  providedIn: 'root'
})
export class ModalEditCategoryService {
constructor(private dialog: MatDialog) {}

  openModal(data:any): void {
    this.dialog.open(ModalEditCategoryComponent, {
      data: {
        category: data
      }
    });
  }

  closeModal(): void {
    this.dialog.closeAll(); 
  }
}
