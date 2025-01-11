import { CommonModule } from '@angular/common';
import { Component, Inject, inject, signal, OnInit } from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { CategoriesService } from '../../../../../core/services/categories/api/categories.service';
import { SavingsService } from '../../../../../core/services/savings/api/savings.service';
import { DataUserService } from '../../../../../core/services/user/data-user.service';
import { TimePickerComponent } from '../../../time/time-picker/time-picker.component';
import { ModalAddSavingComponent } from '../modal-add-saving/modal-add-saving.component';

@Component({
  selector: 'app-modal-edit-saving',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TimePickerComponent,
  ],
  templateUrl: './modal-edit-saving.component.html',
  styleUrl: './modal-edit-saving.component.css',
})
export class ModalEditSavingComponent implements OnInit {
  time: string = '';
  userID: any;
  public currentDate!: string;
  private modalAlertSrv = inject(ModalAlertService);
  categories: any;

  //MODAL
  constructor(
    public dialogRef: MatDialogRef<ModalAddSavingComponent>,
    private categorieSrv: CategoriesService,
    private savingSrv: SavingsService,
    private userSrv: DataUserService,
    @Inject(MAT_DIALOG_DATA) public saving: any
  ) {
    this.getCurrentDate();
    this.userSrv.loadUserData().subscribe();
    this.userID = this.getUserId();
    this.setupFormListeners();
  }

  onTimeSelected(data: any): void {
    this.time = data;
    this.form().patchValue({ goalTime: this.time });
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

  ngOnInit(): void {
    this.form().patchValue({ name: this.saving.name });

    this.form().patchValue({ goalAmount: this.saving.goalAmount });
    this.form().patchValue({ periodicTarget: this.saving.periodicTarget });
    this.form().patchValue({ goalTime: this.saving.goalTime });
    this.form().patchValue({ comment: this.saving.comment });
    this.form().patchValue({ frequency: this.saving.frequency });
    console.log('asdadsas', this.saving);
  }

  //FORMULARIO
  form = signal<FormGroup>(
    new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        goalAmount: new FormControl(0, [
          Validators.required,
          Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
        ]),
        periodicTarget: new FormControl(0, [
          Validators.required,
          Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
        ]),
        goalTime: new FormControl('', [Validators.required]),
        comment: new FormControl('', [Validators.required]),
        frequency: new FormControl(''),

        status: new FormControl(true),
        createdAt: new FormControl(this.getCurrentDate()),
        savedAmount: new FormControl(0),
        user: new FormControl(0),
      },
      { validators: [periodicAmountLessThanGoalAmount()] }
    )
  );

  //ENVIAR FORMULARIO A LA API
  sendForm() {
    console.log(this.form().value);
    this.savingSrv.editSavings(this.saving.id, this.form().value).subscribe({
      next: (response) => {
        this.closeModal();
        this.modalAlertSrv.openCustomDialog(
          'Éxito',
          'Meta de ahorro añadido con éxito',
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

  checkPeriodicTarget() {
    const periodicTarget = this.form().get('periodicTarget');
    const formGroup = this.form();

    if (periodicTarget?.hasError('required') && periodicTarget.touched) {
      return 'Monto requerido';
    } else if (
      formGroup.hasError('periodicAmountGreaterThanGoal') &&
      (periodicTarget?.touched || formGroup.touched)
    ) {
      return 'El monto periódico no puede ser mayor a la meta.';
    } else if (periodicTarget?.hasError('pattern')) {
      return 'Solo se admiten números enteros y dos decimales después del punto.';
    } else if (periodicTarget?.value === 0 && periodicTarget.touched) {
      return 'El valor del monto no puede ser 0.';
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

  // Método para configurar las suscripciones al formulario
  private setupFormListeners(): void {
    this.form()
      .get('goalAmount')
      ?.valueChanges.subscribe(() => {
        this.form().updateValueAndValidity({ onlySelf: false });
      });

    this.form()
      .get('periodicTarget')
      ?.valueChanges.subscribe(() => {
        this.form().updateValueAndValidity({ onlySelf: false });
      });
  }
}

export function periodicAmountLessThanGoalAmount(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.get('goalAmount') || !control.get('periodicTarget')) {
      return null; // Si no existen los controles, no validamos nada
    }

    const goalAmount = control.get('goalAmount')?.value;
    const periodicTarget = control.get('periodicTarget')?.value;

    if (
      goalAmount !== null &&
      periodicTarget !== null &&
      periodicTarget > goalAmount
    ) {
      // Retornamos el error para el grupo
      return { periodicAmountGreaterThanGoal: true };
    }
    return null; // No hay errores
  };
}
