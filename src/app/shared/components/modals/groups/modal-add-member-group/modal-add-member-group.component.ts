import { Component, inject, Inject, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { SavingsService } from '../../../../../core/services/savings/api/savings.service';
import { DataUserService } from '../../../../../core/services/user/data-user.service';
import { ModalAbonoSavingComponent } from '../../savings/modal-abono-saving/modal-abono-saving.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GroupsMembersService } from '../../../../../core/services/groups/api/groups-members.service';

@Component({
  selector: 'app-modal-add-member-group',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-add-member-group.component.html',
  styleUrl: './modal-add-member-group.component.css',
})
export class ModalAddMemberGroupComponent {
  userID: any;
  public currentDate!: string;
  private modalAlertSrv = inject(ModalAlertService);

  constructor(
    public dialogRef: MatDialogRef<ModalAbonoSavingComponent>,
    private userSrv: DataUserService,
    private groupsMemberSrv: GroupsMembersService,
    private membersGroup: GroupsMembersService,
    @Inject(MAT_DIALOG_DATA) public group: any
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
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
    })
  );

  // ENVIAR FORMULARIO A LA API
  sendForm() {
    //buscamos si el usuario existe
    this.userSrv.getUserByEmail(this.form().get('email')?.value).subscribe({
      next: (data) => {
        if (data !== null) {
          ////console.log('datos del usuario a agg', data);
          this.checkMember(data);
        } else {
          this.modalAlertSrv.openCustomDialog(
            'Error',
            'El usuario no existe.',
            'error'
          );
        }
      },
      error: (err) => console.error(err),
    });
  }

  // VERIFICAR SI EL USUARIO YA PERTENECE AL GRUPO
  checkMember(userdata: any) {
    if (userdata.id === this.group.createdBy.id) {
      this.modalAlertSrv.openCustomDialog(
        'Error',
        'No se puede agregar al administrador al grupo',
        'error'
      );
    } else {
      this.membersGroup.getListMembersByGroupId(this.group.id).subscribe({
        next: (members) => {
          if (members !== null) {
            // Verificar si el usuario ya pertenece al grupo
            const userExists = members.some(
              (member: any) => member.id === userdata.id
            );

            if (userExists) {
              this.modalAlertSrv.openCustomDialog(
                'Error',
                'El usuario ya pertenece al grupo.',
                'error'
              );
            } else {
              this.agregarMiembro(this.group.id, userdata.id);
            }
          }
        },
        error: (error) =>
          console.error('Error al verificar miembros del grupo:', error),
      });
    }
  }

  agregarMiembro(groupId: number, userId: number) {
    this.groupsMemberSrv.addMemberToGroup(groupId, userId).subscribe({
      next: () => {
        this.closeModal();
        this.modalAlertSrv.openCustomDialog(
          'Éxito',
          'Usuario añadido con éxito',
          'success'
        );
      },
      error: (err) => {
        console.error(err);
        this.modalAlertSrv.openCustomDialog(
          'Error',
          'Hubo un error al agregar al usuario.',
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
  // savedAmountValidator(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value;
  //     if (value <= 0) {
  //       return { nonPositiveAmount: true };
  //     } else if (value + this.saving.savedAmount > this.saving.goalAmount) {
  //       return { exceedsGoalAmount: true };
  //     }
  //     return null;
  //   };
  // }

  checkEmail(): string {
    const control = this.form().get('email');
    if (control?.hasError('required') && control.touched) {
      return 'Correo requerido!';
    } else if (control?.hasError('pattern')) {
      return 'Correo inválido: (ejemplo@dominio.com).';
    } else {
      return '';
    }
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
