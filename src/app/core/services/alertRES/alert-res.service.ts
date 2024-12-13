import { Injectable } from '@angular/core';
import { AlertComponent } from '../../../shared/components/modales/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertRESComponent } from '../../../shared/components/modales/alert-res/alert-res.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertRESService {
  constructor(private dialog: MatDialog) { }

  // Devuelve un Observable con el valor true o false
  openCustomDialog(titulo: string, mensage: string): Observable<boolean> {
    const dialogRef = this.dialog.open(AlertRESComponent, {
      data: { title: titulo, message: mensage }
    });

    return dialogRef.afterClosed();  // Emite el valor cuando el diálogo se cierra
  }
}
