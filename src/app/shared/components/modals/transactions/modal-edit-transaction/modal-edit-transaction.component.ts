import { Component, Inject, inject, input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { CategoriesService } from '../../../../../core/services/categories/api/categories.service';
import { TransactionsService } from '../../../../../core/services/transactions/api/transactions.service';
import { InputCategoryComponent } from '../../../input-category/input-category.component';

@Component({
  selector: 'app-modal-edit-transaction',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputCategoryComponent,
  ],
  templateUrl: './modal-edit-transaction.component.html',
  styleUrl: './modal-edit-transaction.component.css',
})
export class ModalEditTransactionComponent {
  public currentDate!: string;
  categories: { id: number; name: string; image: Blob; type: string }[] = [];
  public defaultCategory!: number;

  constructor(
    public dialogRef: MatDialogRef<ModalEditTransactionComponent>,
    private categorieSrv: CategoriesService,
    private transactionSrv: TransactionsService,
    private modalAlertSrv: ModalAlertService,
    @Inject(MAT_DIALOG_DATA) public data: { transaction: any }
  ) {
    this.getCurrentDate();
  }

  // Cambiar a WritableSignal para manipular el formulario
  form = signal<FormGroup>(
    new FormGroup({
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
      ]),
      categoryID: new FormControl('', [Validators.required]),
      date: new FormControl(this.getCurrentDate(), [Validators.required]),
      description: new FormControl('', [Validators.required]),
      userId: new FormControl(''),
      type: new FormControl(''),
    })
  );

  getCategoryID(categoryID: any): void {
    this.form().patchValue({ categoryID: categoryID });
    //console.log('Categoria seleccionada:', categoryID);
  }

  ngOnInit(): void {
    // Asignar valores directamente al formulario en el constructor
    if (this.data && this.data.transaction) {
      this.defaultCategory = this.data.transaction.categoryID.id;
      ////console.log(this.data);
      this.form().patchValue({
        amount: this.data.transaction.amount,
        categoryID: this.data.transaction.categoryID.id,
        date: this.nomalizarFecha(this.data.transaction.date),
        description: this.data.transaction.description,
      });
    }
  }

  nomalizarFecha(date: any) {
    return new Date(date).toISOString().split('T')[0];
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteArray], { type: mimeType });
  }

  getCurrentDate(): string {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Ajuste para la zona horaria
    return (this.currentDate = today.toISOString().split('T')[0]); // Formato 'YYYY-MM-DD'
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  // Enviar formulario a la API
  sendForm() {
    this.form().patchValue({ userId: this.getUserId() }); // Asignar el userId al formulario
    this.form().patchValue({ type: this.data.transaction.type });
    //console.log(this.form().value);
    this.transactionSrv
      .updateTransaction(this.data.transaction.id, this.form().value)
      .subscribe({
        next: (response) => {
          this.closeModal();
          this.modalAlertSrv.openCustomDialog(
            'Éxito',
            'Transacción modificada con éxito',
            'success'
          );
          this.transactionSrv.getTransactionsByUserId().subscribe({
            error: (error) => {
              console.error(
                'Error al cargar las transacciones iniciales:',
                error
              );
            },
          });
        },
        error: (err) => {
          console.error(err);
          this.modalAlertSrv.openCustomDialog('Error', err, 'error');
        },
      });
  }

  // Obtener Id de LocalStorage
  getUserId(): any {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.id;
  }

  // Validaciones formulario
  checkMount() {
    const control = this.form().get('amount');
    if (control?.hasError('required') && control.touched) {
      return 'Monto requerido';
    } else if (control?.hasError('pattern')) {
      return 'Solo se admiten números enteros y dos decimales después del punto.';
    } else if (control?.value === 0 && control.touched) {
      return 'El valor del monto no puede ser 0.';
    }
    return '';
  }

  checkCategory() {
    const control = this.form().get('categoryID');
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

  hasRequiredError(field: string): boolean {
    const control = this.form().get(field);
    return control?.hasError('required') && control.touched ? true : false;
  }
}
