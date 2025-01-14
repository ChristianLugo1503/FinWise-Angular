import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DataUserService } from '../../../../../core/services/user/data-user.service';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { CategoriesService } from '../../../../../core/services/categories/api/categories.service';
import { ModalAddTransactionComponent } from '../../transactions/modal-add-transaction/modal-add-transaction.component';

@Component({
  selector: 'app-modal-edit-category',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-edit-category.component.html',
  styleUrl: './modal-edit-category.component.css',
})
export class ModalEditCategoryComponent {
  categoryForm: FormGroup;
  image: any;
  userData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { category: any },
    public dialogRef: MatDialogRef<ModalAddTransactionComponent>,
    public categoriesSrv: CategoriesService,
    public userSrv: DataUserService,
    public alert: ModalAlertService
  ) {
    this.categoryForm = new FormGroup({
      description: new FormControl(this.data.category.name, [
        Validators.required,
      ]),
      type: new FormControl(this.data.category.type, [Validators.required]),
      image: new FormControl(''),
      color: new FormControl(this.data.category.color, [Validators.required]),
    });

    const previewElement = document.getElementById(
      'image-preview'
    ) as HTMLElement;

    if (previewElement) {
      const imageBlob = this.data.category.image;
      if (imageBlob) {
        previewElement.style.backgroundImage = `url('${imageBlob}')`;
        previewElement.style.backgroundSize = 'cover';
        previewElement.style.backgroundPosition = 'center';
      } else {
        console.warn('No se encontró la imagen');
      }
    }

    console.log('yaaaaaaaaaaaaaaaaaaa', this.data.category.image);

    this.userSrv.getUserData().subscribe({
      next: (data) => {
        if (data) this.userData = data;
      },
      error: (error) => console.error(error),
    });

    console.log('Data:', this.data);
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
      const color = this.categoryForm.value.color;
      let image = this.image;

      // Llamamos a la función para editar la categoría
      this.categoriesSrv
        .editCategory(this.data.category.id, name, type, image, color)
        .subscribe({
          next: (data) => {
            console.log('Categoría editada:', data);
            this.categoriesSrv.getCategoriesByUserId().subscribe(); // Actualizamos las categorías
            this.alert.openCustomDialog(
              'Categoría actualizada',
              'La categoría se ha actualizado correctamente.',
              'success'
            );
            this.dialogRef.close();
          },
          error: (error) => {
            console.error('Error al actualizar la categoría:', error);
          },
        });
    } else {
      console.log('Formulario inválido');
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
