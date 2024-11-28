import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from '../../../core/services/categories/categories.service';

@Component({
  selector: 'app-modal-add-transaction',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
],
  templateUrl: './modal-add-transaction.component.html',
  styleUrl: './modal-add-transaction.component.css'
})
export class ModalAddTransactionComponent{
  categories: { name: string, image: Blob , type: string}[] = [];

  //MODAL
  constructor(

    public dialogRef: MatDialogRef<ModalAddTransactionComponent>,
    private categorieSrv: CategoriesService,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }

  ) {

    this.categorieSrv.getUserData().subscribe(data => {
      console.log('Categorias del usuario cargadas desde el modal', data);
      this.categories = data.map((category: { name: any; image: any; type: any }) => {
        const blob = this.base64ToBlob(category.image, 'image/jpeg');
        return {
          name: category.name,
          image: URL.createObjectURL(blob),
          type: category.type,
        }
      });
    });

  }

  // Ejemplo de función para convertir Base64 a Blob en un Web Worker
  base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([byteArray], { type: mimeType });
}


  selectCategory(categoryName: string): void {
    console.log('Categoría seleccionada:', categoryName);
    // Aquí puedes agregar lógica adicional si es necesario
  }
  

  closeModal(): void {
    this.dialogRef.close();
  }

  //FORMULARIO
  form = signal<FormGroup>(
    new FormGroup({
      mount: new FormControl(0, [
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
      ]),
      category: new FormControl('',[
        Validators.required
      ]),
      date: new FormControl('',[
        Validators.required
      ]),
      comment: new FormControl('',[
        Validators.required
      ])
    })
  );

  checkMount(){
    const control = this.form().get('mount');
    if(control?.hasError('required') && control.touched){
      return 'Monto requerido'
    }else if (control?.hasError('pattern')){
      return 'Solo se admiten números enteros y dos decimales despúes del punto.'
    }else if (control?.value === 0 && control.touched) {
      return 'El valor del monto no puede ser 0.'
      //seria mejor un alert
    }
    else {
      return '';
    }
  }

  checkCategory() {
    const control = this.form().get('category');
    if (control?.hasError('required') && control.touched) {
      return 'Categoría requerida';
    }
    return '';
  }

  checkDate() {
    const control = this.form().get('date');
    if (control?.hasError('required') && control.touched) {
      return 'Fecha requerida';
    }
    return '';
  }

  hasRequiredError(fiel:string):boolean{
    const control = this.form().get(fiel);
    if(control?.hasError('required') && control.touched){
      return true
    }else{

      return false
    }
  }

}
