import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { CategoriesService } from '../../../../../core/services/categories/api/categories.service';
import { TransactionsService } from '../../../../../core/services/transactions/api/transactions.service';
import { InputCategoryComponent } from '../../../input-category/input-category.component';
import { DataUserService } from '../../../../../core/services/user/data-user.service';

@Component({
  selector: 'app-modal-add-transaction',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputCategoryComponent,
  ],
  templateUrl: './modal-add-transaction.component.html',
  styleUrl: './modal-add-transaction.component.css',
})
export class ModalAddTransactionComponent {
  public currentDate!: string;
  private modalAlertSrv = inject(ModalAlertService);
  categories: { id: number; name: string; image: Blob; type: string }[] = [];

  //MODAL
  constructor(
    public dialogRef: MatDialogRef<ModalAddTransactionComponent>,
    private categorieSrv: CategoriesService,
    private transactionSrv: TransactionsService,
    private userSrv: DataUserService,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {
    this.getCurrentDate();
    this.getUserId();
  }

  getCategoryID(categoryID: any): void {
    this.form().patchValue({ categoryID: categoryID });
    //console.log('Categoria seleccionada:', categoryID);
  }

  get filteredCategories() {
    return this.categories.filter((cat) => cat.type === this.data.title);
  }

  getCurrentDate(): string {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Ajuste para la zona horaria
    return (this.currentDate = today.toISOString().split('T')[0]); // Formato 'YYYY-MM-DD'
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  //FORMULARIO
  form = signal<FormGroup>(
    new FormGroup({
      amount: new FormControl(0, [
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

  //ENVIAR FORMULARIO A LA API
  sendForm() {
    this.form().patchValue({ type: this.data.title });
    this.transactionSrv.createTransaction(this.form().value).subscribe({
      next: (response) => {
        this.closeModal();
        this.modalAlertSrv.openCustomDialog(
          'Éxito',
          'Transacción añadida con éxito',
          'success'
        );
        ////console.log(response);
        // Llamar a getTransactionsByUserId() para cargar datos iniciales
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

  getUserId(): any {
    this.userSrv.getUserData().subscribe((data) => {
      if (data !== null) {
        this.form().patchValue({ userId: data.id });
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
