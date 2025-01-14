import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DataUserService } from '../../../../../core/services/user/data-user.service';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { CategoriesService } from '../../../../../core/services/categories/api/categories.service';
import { ModalAddTransactionComponent } from '../../transactions/modal-add-transaction/modal-add-transaction.component';

@Component({
  selector: 'app-modal-new-category',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-new-category.component.html',
  styleUrl: './modal-new-category.component.css',
})
export class ModalNewCategoryComponent {
  categoryForm: FormGroup;
  image: any;
  userData: any;

  constructor(
    public dialogRef: MatDialogRef<ModalAddTransactionComponent>,
    public categoriesSrv: CategoriesService,
    public userSrv: DataUserService,
    public alert: ModalAlertService
  ) {
    this.categoryForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      color: new FormControl('#FFFFFF'),
    });

    this.userSrv.getUserData().subscribe({
      next: (data) => {
        if (data) this.userData = data;
      },
      error: (error) => console.error(error),
    });
  }

  // Método para comprobar si hay errores en los campos
  hasRequiredError(field: string): boolean {
    const control = this.categoryForm.get(field);
    return control?.hasError('required') && control.touched ? true : false;
  }

  sendForm(): void {
    if (this.categoryForm.valid) {
      // Obtén los valores del formulario
      const name = this.categoryForm.value.description;
      const type = this.categoryForm.value.type;
      const userId = this.userData.id;
      const image = this.image;
      const color = this.categoryForm.value.color;

      // Llamamos a la función para crear la categoría
      this.categoriesSrv
        .createCategory(name, type, userId, image, color)
        .subscribe({
          next: (data) => {
            //console.log('Categoría creada:', data);
            this.categoriesSrv.getCategoriesByUserId().subscribe(); // Actualizamos las categorías
            this.alert.openCustomDialog(
              'Categoría creada',
              'La categoría se ha creado correctamente',
              'success'
            );
            this.dialogRef.close();
          },
          error: (error) => {
            console.error('Error al crear la categoría:', error);
          },
        });
    } else {
      //console.log('Formulario inválido');
    }
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.image = file; // Asignamos el archivo a una variable

      const reader = new FileReader();
      reader.onload = () => {
        const previewElement = document.getElementById(
          'image-preview'
        ) as HTMLElement;
        if (previewElement) {
          previewElement.style.backgroundImage = `url(${reader.result})`;
          previewElement.style.backgroundSize = 'cover';
          previewElement.style.backgroundPosition = 'center';
        }
      };
      reader.readAsDataURL(file);
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
