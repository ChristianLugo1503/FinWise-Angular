import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpecsCategoriesComponent } from '../../../shared/components/modales/specs-categories/specs-categories.component';

@Injectable({
  providedIn: 'root'
})
export class ModalSpecsCategoriesService {
  constructor(private dialog: MatDialog) {}

  openModal(titulo: string, imagen:string): void {
    this.dialog.open(SpecsCategoriesComponent, {
      data: {
        title: titulo,
        img: imagen
      }
    });
  }

  closeModal(): void {
    this.dialog.closeAll(); 
  }
}
