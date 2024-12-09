import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../../shared/components/modales/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class ModalAlertService {

  constructor(private dialog: MatDialog) { }

  openCustomDialog(titulo:string, mensage:string, icono:string): void {
    this.dialog.open(AlertComponent, {
        data: {
        title:titulo,
        message: mensage,
        icon: icono
      }
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

}
