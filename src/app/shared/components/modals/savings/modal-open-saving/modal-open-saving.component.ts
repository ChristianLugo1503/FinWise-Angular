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
import { DataUserService } from '../../../../../core/services/user/data-user.service';
import { ModalAddSavingComponent } from '../modal-add-saving/modal-add-saving.component';
import { CustomCurrencyPipe } from '../../../../pipes/currency/custom-currency.pipe';
import { ModalAbonoSavingService } from '../../../../../core/services/savings/modals/modal-abono-saving.service';
import { SavingsService } from '../../../../../core/services/savings/api/savings.service';

@Component({
  selector: 'app-modal-open-saving',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomCurrencyPipe,
  ],
  templateUrl: './modal-open-saving.component.html',
  styleUrl: './modal-open-saving.component.css',
})
export class ModalOpenSavingComponent {
  saving: any;

  constructor(
    public dialogRef: MatDialogRef<ModalAddSavingComponent>,
    private savingsSrv: SavingsService,
    private abonoSrv: ModalAbonoSavingService,
    @Inject(MAT_DIALOG_DATA) public savingId: any
  ) {
    this.savingsSrv
      .getSavingsByUserId()
      .subscribe({ error: (error) => console.error(error) });
  }

  ngOnInit(): void {
    this.savingsSrv.getSavingsData().subscribe({
      next: (data) => {
        if (data !== null) {
          this.saving = data.find(
            (saving: any) => saving.id === this.savingId.id
          ); // Encuentra la meta específica
        }
      },
      error: (error) => console.error(error),
    });
  }

  openAbonar(saving: any) {
    this.abonoSrv.openModal(saving);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
