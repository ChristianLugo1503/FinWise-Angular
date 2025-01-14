import { CommonModule } from '@angular/common';
import { Component, inject, Inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { SavingsService } from '../../../../../core/services/savings/api/savings.service';
import { DataUserService } from '../../../../../core/services/user/data-user.service';

@Component({
  selector: 'app-modal-abono-saving',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-abono-saving.component.html',
  styleUrls: ['./modal-abono-saving.component.css'],
})
export class ModalAbonoSavingComponent {
  userID: any;
  public currentDate!: string;
  private modalAlertSrv = inject(ModalAlertService);

  constructor(
    public dialogRef: MatDialogRef<ModalAbonoSavingComponent>,
    private savingSrv: SavingsService,
    private userSrv: DataUserService,
    @Inject(MAT_DIALOG_DATA) public saving: any
  ) {
    this.getCurrentDate();
    this.userSrv.loadUserData().subscribe();
    this.userID = this.getUserId();
  }

  getCurrentDate(): string {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString();
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}

  // FORMULARIO
  form = signal<FormGroup>(
    new FormGroup({
      savedAmount: new FormControl(0, [
        Validators.required,
        Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
        this.savedAmountValidator(),
      ]),
    })
  );

  // ENVIAR FORMULARIO A LA API
  sendForm() {
    const updatedSaving =
      this.form().get('savedAmount')?.value + this.saving.savedAmount;

    ////console.log('ahorro actualizado', updatedSaving);

    this.savingSrv.abonar(this.saving.id, updatedSaving).subscribe({
      next: () => {
        this.closeModal();
        this.modalAlertSrv.openCustomDialog(
          'Éxito',
          'Abono añadido con éxito',
          'success'
        );
      },
      error: (err) => {
        console.error(err);
        this.modalAlertSrv.openCustomDialog(
          'Error',
          'Hubo un error al procesar el abono',
          'error'
        );
      },
    });
  }

  getUserId(): any {
    this.userSrv.getUserData().subscribe((data) => {
      if (data !== null) {
        this.userID = data.id;
      }
    });
  }

  // VALIDACIONES PERSONALIZADAS
  savedAmountValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value <= 0) {
        return { nonPositiveAmount: true };
      } else if (value + this.saving.savedAmount > this.saving.goalAmount) {
        return { exceedsGoalAmount: true };
      }
      return null;
    };
  }

  checkSavedAmount() {
    const control = this.form().get('savedAmount');
    if (control?.hasError('required') && control.touched) {
      return 'El monto es requerido';
    } else if (control?.hasError('pattern')) {
      return 'Solo se admiten números enteros y dos decimales después del punto';
    } else if (control?.hasError('nonPositiveAmount')) {
      return 'El monto debe ser mayor a 0';
    } else if (control?.hasError('exceedsGoalAmount')) {
      return 'El abono excede la meta de ahorro';
    }
    return '';
  }
}
