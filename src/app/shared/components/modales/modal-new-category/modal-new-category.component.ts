import { Component, inject, Inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ModalAlertService } from '../../../../core/services/alert/modal-alert.service';
import { CategoriesService } from '../../../../core/services/categories/categories.service';
import { TransactionsService } from '../../../../core/services/transactions/transactions.service';
import { ModalAddTransactionComponent } from '../modal-add-transaction/modal-add-transaction.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalNewCategoryService } from '../../../../core/services/modalNewCategory/modal-new-category.service';
import { DataUserService } from '../../../../core/services/dataUser/data-user.service';

@Component({
  selector: 'app-modal-new-category',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
],
  templateUrl: './modal-new-category.component.html',
  styleUrl: './modal-new-category.component.css'
})
export class ModalNewCategoryComponent {
  categoryForm: FormGroup;
  image: any;
  userData: any;

  constructor(
    public dialogRef: MatDialogRef<ModalAddTransactionComponent>,
    public categoriesSrv: CategoriesService,
    public userSrv: DataUserService
  ) {
    this.categoryForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      color: new FormControl('#FFFFFF')  
    });

    this.userSrv.getUserData().subscribe({
      next: (data) => {
        if (data) this.userData = data;
      },
      error: (error) => console.error(error)
    });
  }

  // Método para comprobar si hay errores en los campos
  hasRequiredError(field: string): boolean {
    const control = this.categoryForm.get(field);
    return control?.hasError('required') && control.touched ? true : false;
  }

  ngOnInit(): void {}

  sendForm(): void {
    if (this.categoryForm.valid) {
      // Obtén los valores del formulario
      const name = this.categoryForm.value.description;
      const type = this.categoryForm.value.type;
      const userId = this.userData.id;
      const image = this.image;
      const color = this.categoryForm.value.color; 

      // Llamamos a la función para crear la categoría
      this.categoriesSrv.createCategory(name, type, userId, image, color).subscribe({
        next: (data) => {
          console.log('Categoría creada:', data);
        },
        error: (error) => {
          console.error('Error al crear la categoría:', error);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.image = file;  // Asignamos el archivo a una variable
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

  


