import { CommonModule } from '@angular/common';
import { Component, Inject, inject, Input, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    MatDialogTitle, 
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose, 
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  
  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, title:string , icon:string} ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
