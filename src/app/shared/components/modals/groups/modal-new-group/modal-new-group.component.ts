import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { SavingsService } from '../../../../../core/services/savings/api/savings.service';
import { DataUserService } from '../../../../../core/services/user/data-user.service';
import { GroupsService } from '../../../../../core/services/groups/api/groups.service';

@Component({
  selector: 'app-modal-new-group',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-new-group.component.html',
  styleUrl: './modal-new-group.component.css',
})
export class ModalNewGroupComponent {
  time: string = '';
  public currentDate!: string;
  private modalAlertSrv = inject(ModalAlertService);

  constructor(
    public dialogRef: MatDialogRef<ModalNewGroupComponent>,
    private groupsSrv: GroupsService,
    private userSrv: DataUserService
  ) {
    this.getCurrentDate();
    this.userSrv.loadUserData().subscribe();
    this.getUserId();
    this.setupFormListeners();
  }

  getCurrentDate(): string {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString();
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  form = signal<FormGroup>(
    new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        goalAmount: new FormControl(0, [
          Validators.required,
          Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
        ]),
        createdAt: new FormControl(this.getCurrentDate()),
        updatedAt: new FormControl(this.getCurrentDate()),
        savedAmount: new FormControl(0),
        createdBy: new FormControl(0),
      },
      { validators: [periodicAmountLessThanGoalAmount()] }
    )
  );

  sendForm() {
    //console.log('datos a enviar', this.form().value);
    this.groupsSrv.createGroup(this.form().value).subscribe({
      next: () => {
        this.closeModal();
        this.modalAlertSrv.openCustomDialog(
          'Éxito',
          'Grupo de pago creado correctamente.',
          'success'
        );
      },
      error: (err) => {
        console.error(err);
        this.modalAlertSrv.openCustomDialog('Error', err, 'error');
      },
    });
  }

  checkMount(tipo: string) {
    const control = this.form().get(tipo);
    //const control = this.form().get('amount');
    if (control?.hasError('required') && control.touched) {
      return 'Monto requerido';
    } else if (control?.hasError('pattern')) {
      return 'Solo se admiten números enteros y dos decimales despúes del punto.';
    } else if (control?.value === 0 && control.touched) {
      return 'El valor del monto no puede ser 0.';
    } else {
      return '';
    }
  }

  hasRequiredError(fiel: string): boolean {
    const control = this.form().get(fiel);
    if (control?.hasError('required') && control.touched) {
      return true;
    } else {
      return false;
    }
  }

  getUserId(): void {
    this.userSrv.getUserData().subscribe((data) => {
      if (data !== null) {
        this.form().patchValue({ createdBy: data.id });
      }
    });
  }

  private setupFormListeners(): void {
    this.form()
      .get('goalAmount')
      ?.valueChanges.subscribe(() => {
        this.form().updateValueAndValidity({ onlySelf: false });
      });
  }
}

export function periodicAmountLessThanGoalAmount(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const goalAmount = control.get('goalAmount')?.value;
    const periodicTarget = control.get('periodicTarget')?.value;

    if (
      goalAmount !== null &&
      periodicTarget !== null &&
      periodicTarget > goalAmount
    ) {
      return { periodicAmountGreaterThanGoal: true };
    }
    return null;
  };
}
