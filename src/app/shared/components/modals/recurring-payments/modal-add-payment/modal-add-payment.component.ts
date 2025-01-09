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
import { InputCategoryComponent } from '../../../input-category/input-category.component';
import { DataUserService } from '../../../../../core/services/user/data-user.service';

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
    InputCategoryComponent,
  ],
  templateUrl: './modal-add-payment.component.html',
  styleUrl: './modal-add-payment.component.css',
})
export class ModalAddPaymentComponent {
  time: string = '';
  userID: any;
  public currentDate!: string;
  private modalAlertSrv = inject(ModalAlertService);
  categories: any;

  //MODAL
  constructor(
    public dialogRef: MatDialogRef<ModalAddTransactionComponent>,
    private categorieSrv: CategoriesService,
    private paymentsSrv: RecurringPaymentsService,
    private userSrv: DataUserService,
    @Inject(MAT_DIALOG_DATA) public data: { type: string }
  ) {
    this.getCurrentDate();
    this.userSrv.loadUserData().subscribe();
    this.userID = this.getUserId();
  }

  onTimeSelected(data: any): void {
    this.time = data;
    this.form().patchValue({ reminderTime: this.time });
    console.log(data);
    //console.log('Hora seleccionadaaaaaaaaaaaaaaaaaaaaa:', this.time);
  }

  getCategoryID(categoryID: any): void {
    this.form().patchValue({ categoryID: categoryID });
    console.log('Categoria seleccionada:', categoryID);
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
      user: new FormControl(0),
      type: new FormControl(''),
    })
  );

  //ENVIAR FORMULARIO A LA API
  sendForm() {
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
      },
      error: (err) => {
        console.error(err);
        this.modalAlertSrv.openCustomDialog('Error', err, 'error');
      },
    });
  }

  getUserId(): any {
    this.userSrv.getUserData().subscribe((data) => {
      if (data !== null) {
        this.form().patchValue({ user: data.id });
      }
    });
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
