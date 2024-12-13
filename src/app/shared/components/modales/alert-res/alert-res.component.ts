import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-alert-res',
  imports: [],
  templateUrl: './alert-res.component.html',
  styleUrl: './alert-res.component.css'
})
export class AlertRESComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertRESComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, title: string }
  ) {}

  // Cuando se hace clic en "Aceptar"
  onConfirm(): void {
    this.dialogRef.close(true);  // Devuelve true al cerrar el diálogo
  }

  // Cuando se hace clic en "Cancelar"
  onCancel(): void {
    this.dialogRef.close(false);  // Devuelve false al cerrar el diálogo
  }
}
