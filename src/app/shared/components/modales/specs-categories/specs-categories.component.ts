import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-specs-categories',
  imports: [],
  templateUrl: './specs-categories.component.html',
  styleUrl: './specs-categories.component.css'
})
export class SpecsCategoriesComponent {
  constructor(
    public dialogRef: MatDialogRef<SpecsCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, img: string  }
  ){

  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
