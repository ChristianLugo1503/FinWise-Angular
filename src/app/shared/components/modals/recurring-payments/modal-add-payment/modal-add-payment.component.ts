import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { CategoriesService } from '../../../../../core/services/categories/api/categories.service';
import { TransactionsService } from '../../../../../core/services/transactions/api/transactions.service';
import { ModalAddTransactionComponent } from '../../transactions/modal-add-transaction/modal-add-transaction.component';
import { TimePickerComponent } from '../../../time/time-picker/time-picker.component';
import { RecurringPaymentsService } from '../../../../../core/services/recurringPayments/api/recurring-payments.service';

@Component({
  selector: 'app-modal-add-payment',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TimePickerComponent,
  ],
  templateUrl: './modal-add-payment.component.html',
  styleUrl: './modal-add-payment.component.css',
})
export class ModalAddPaymentComponent {
  time: string = '';
  public currentDate!: string;
  private modalAlertSrv = inject(ModalAlertService);
  categories: any;

  //MODAL
  constructor(
    public dialogRef: MatDialogRef<ModalAddTransactionComponent>,
    private categorieSrv: CategoriesService,
    private paymentsSrv: RecurringPaymentsService,
    @Inject(MAT_DIALOG_DATA) public data: { type: String }
  ) {
    this.getCurrentDate();
    this.categorieSrv.getCategoriesByUserId().subscribe();
    this.loadCategories();
    //console.log('Data:', this.data.type);
  }

  loadCategories(): void {
    this.categorieSrv.getCategoriesData().subscribe((data) => {
      if (data !== null) {
        this.categories = data
          .filter((category: { type: any }) => category.type === this.data.type)
          .map((category: any) => {
            if (category.image && !category.image.startsWith('blob:')) {
              const blob = this.base64ToBlob(category.image, 'image/jpeg');
              category.image = URL.createObjectURL(blob) || null;
            }
            return category;
          });
      }
    });
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    //console.log('base64:', base64);
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteArray], { type: mimeType });
  }

  onTimeSelected(data: any): void {
    this.time = data;
    this.form().patchValue({ reminderTime: this.time });
    console.log(data);
    console.log('Hora seleccionadaaaaaaaaaaaaaaaaaaaaa:', this.time);
  }

  selectCategory(categoryName: number): void {
    //console.log('Categoría seleccionada:', categoryName);
  }

  getCurrentDate(): string {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString();
  }

  closeModal(): void {
    // Limpiar las categorías y cualquier dato asociado
    this.categories = [];
    this.categorieSrv.clearData();

    this.dialogRef.close();
  }

  //FORMULARIO
  form = signal<FormGroup>(
    new FormGroup({
      name: new FormControl('', [Validators.required]),
      categoryID: new FormControl('', [Validators.required]),
      amount: new FormControl(0, [
        Validators.required,
        Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
      ]),
      reminderTime: new FormControl('', [Validators.required]),
      comment: new FormControl('', [Validators.required]),
      frequency: new FormControl(''),

      status: new FormControl(true),
      createdAt: new FormControl(this.getCurrentDate()),
      updatedAt: new FormControl(null),
      user: new FormControl(''),
      type: new FormControl(''),
    })
  );

  //ENVIAR FORMULARIO A LA API
  sendForm() {
    this.form().patchValue({ user: this.getUserId() }); //asignar el user id al formulario
    this.form().patchValue({ type: this.data.type });
    console.log(this.form().value);
    this.paymentsSrv.createRecurrentPayment(this.form().value).subscribe({
      next: (response) => {
        this.closeModal();
        this.modalAlertSrv.openCustomDialog(
          'Éxito',
          'Pago recurrente añadido con éxito',
          'success'
        );
        //console.log(response);
        // Llamar a getTransactionsByUserId() para cargar datos iniciales
        // this.transactionSrv.getTransactionsByUserId().subscribe({
        //   error: (error) => {
        //     console.error(
        //       'Error al cargar las transacciones iniciales:',
        //       error
        //     );
        //   },
        // });
      },
      error: (err) => {
        console.error(err);
        this.modalAlertSrv.openCustomDialog('Error', err, 'error');
      },
    });
  }

  //Optener Id de LocalStorage
  getUserId(): any {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.id;
    return userId;
  }

  //VALIDACIONES FORMULARIO
  checkMount() {
    const control = this.form().get('amount');
    if (control?.hasError('required') && control.touched) {
      return 'Monto requerido';
    } else if (control?.hasError('pattern')) {
      return 'Solo se admiten números enteros y dos decimales despúes del punto.';
    } else if (control?.value === 0 && control.touched) {
      return 'El valor del monto no puede ser 0.';
      //seria mejor un alert
    } else {
      return '';
    }
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

  hasRequiredError(fiel: string): boolean {
    const control = this.form().get(fiel);
    if (control?.hasError('required') && control.touched) {
      return true;
    } else {
      return false;
    }
  }
}
