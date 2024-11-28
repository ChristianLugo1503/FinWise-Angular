import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddTransactionComponent } from '../../../business/home/modal-add-transaction/modal-add-transaction.component';

@Injectable({
  providedIn: 'root'
})
export class ModalAddTransactionService {
  constructor(private dialog: MatDialog) {}

  openModal(titulo: string, mensaje: string, icono: string): void {
    this.dialog.open(ModalAddTransactionComponent, {
      data: {
        title: titulo
      }
    });
  }

  closeModal(): void {
    this.dialog.closeAll(); 
  }
}
