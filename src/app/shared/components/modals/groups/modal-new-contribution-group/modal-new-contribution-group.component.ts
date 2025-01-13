import { CommonModule } from '@angular/common';
import { Component, inject, Inject, signal } from '@angular/core';
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
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { DataUserService } from '../../../../../core/services/user/data-user.service';
import { ModalAbonoSavingComponent } from '../../savings/modal-abono-saving/modal-abono-saving.component';
import { GroupsContributionsService } from '../../../../../core/services/groups/api/groups-contributions.service';
import { GroupsService } from '../../../../../core/services/groups/api/groups.service';
import { NotificationsService } from '../../../../../core/services/notifications/api/notifications.service';
import { GroupsMembersService } from '../../../../../core/services/groups/api/groups-members.service';

@Component({
  selector: 'app-modal-new-contribution-group',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-new-contribution-group.component.html',
  styleUrl: './modal-new-contribution-group.component.css',
})
export class ModalNewContributionGroupComponent {
  userID: any;
  public currentDate!: string;
  private modalAlertSrv = inject(ModalAlertService);
  miembros: any;
  user: any;

  constructor(
    public dialogRef: MatDialogRef<ModalAbonoSavingComponent>,
    private contributionsSrv: GroupsContributionsService,
    private userSrv: DataUserService,
    private groupSrv: GroupsService,
    private notificationSrv: NotificationsService,
    private membersGroup: GroupsMembersService,
    @Inject(MAT_DIALOG_DATA) public group: any
  ) {
    this.getCurrentDate();
    this.userSrv.loadUserData().subscribe();
    this.userID = this.getUserId();

    console.log('data contribuciones', this.group);
  }

  getCurrentDate(): string {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString();
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.form().patchValue({ group: this.group.id });
  }

  // FORMULARIO
  form = signal<FormGroup>(
    new FormGroup({
      amount: new FormControl(0, [
        Validators.required,
        Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
        //this.savedAmountValidator(),
      ]),
      note: new FormControl('', [Validators.required]),

      group: new FormControl(),
      user: new FormControl(0),
      // date: new FormControl(0),
      status: new FormControl('Pendiente'),
      createdAt: new FormControl(this.getCurrentDate()),
    })
  );

  // ENVIAR FORMULARIO A LA API
  sendForm() {
    this.getUserId();
    console.log('userrrrrrrrrrrrrrrrrrrr', this.user);
    const updatedSaving =
      this.form().get('amount')?.value + this.group.savedAmount;
    this.contributionsSrv.createContribution(this.form().value).subscribe({
      next: () => {
        this.closeModal();
        this.updateSavedAmount();
        this.modalAlertSrv.openCustomDialog(
          'Éxito',
          'Contribucion añadida con éxito',
          'success'
        );
        this.sendNotificationAllMembers();
        const message =
          '¡Contribución recibida en el grupo de pago! 💸🎉<br>' +
          '<br>' +
          'Se informa que <b>' +
          this.user.name +
          ' ' +
          this.user.lastname +
          '</b> ha realizado una contribución de <b>$' +
          this.form().get('amount')?.value +
          ' MXN</b> al grupo <b>' +
          this.group.name +
          '<br>' +
          'El monto total recaudado hasta ahora es de <b>$' +
          updatedSaving +
          ' MXN</b>. ¡Estamos acercándonos cada vez más a nuestra meta de <b>$' +
          this.group.goalAmount +
          ' MXN</b>! 🚀💪<br>' +
          '<br>' +
          '¡Sigamos trabajando juntos para alcanzar la meta! 💫';
        this.createNotification(this.group.createdBy.id, 'grupo_pago', message);
      },
      error: (err) => {
        console.error(err);
        this.modalAlertSrv.openCustomDialog(
          'Error',
          'Hubo un error al procesar la contribucion.',
          'error'
        );
      },
    });
  }

  sendNotificationAllMembers() {
    const updatedSaving =
      this.form().get('amount')?.value + this.group.savedAmount;
    this.membersGroup.getMembersListData().subscribe({
      next: (data) => {
        if (data !== null) {
          this.miembros = data;
          console.log('miembros desde get members', data);

          // Itera sobre los miembros y crea una notificación para cada uno
          this.miembros.forEach((miembro: any) => {
            const user = miembro.id;
            const type = 'grupo_pago';
            const message =
              '¡Contribución recibida en el grupo de pago! 💸🎉<br>' +
              '<br>' +
              'Se informa que <b>' +
              this.user.name +
              ' ' +
              this.user.lastname +
              '</b> ha realizado una contribución de <b>$' +
              this.form().get('amount')?.value +
              ' MXN</b> al grupo <b>' +
              this.group.name +
              '<br>' +
              'El monto total recaudado hasta ahora es de <b>$' +
              updatedSaving +
              ' MXN</b>. ¡Estamos acercándonos cada vez más a nuestra meta de <b>$' +
              this.group.goalAmount +
              ' MXN</b>! 🚀💪<br>' +
              '<br>' +
              '¡Sigamos trabajando juntos para alcanzar la meta! 💫';
            this.createNotification(user, type, message);
          });
        }
      },
      error: (error) => console.error(error),
    });
  }

  createNotification(user: number, type: string, message: string) {
    const data = { user, type, message };
    this.notificationSrv.createNotification(data).subscribe({
      error: (err) => {
        console.error(err);
      },
    });
  }

  updateSavedAmount() {
    const updatedSaving =
      this.form().get('amount')?.value + this.group.savedAmount;
    //console.log('ahorro actualizado', updatedSaving);
    this.groupSrv.abonar(this.group.id, updatedSaving).subscribe({
      next: () => {
        this.closeModal();
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
        this.form().patchValue({ user: data.id });
        this.user = data;
      }
    });
  }

  // VALIDACIONES PERSONALIZADAS
  savedAmountValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value <= 0) {
        return { nonPositiveAmount: true };
      }
      return null;
    };
  }

  hasRequiredError(fiel: string): boolean {
    const control = this.form().get(fiel);
    if (control?.hasError('required') && control.touched) {
      return true;
    } else {
      return false;
    }
  }

  checkSavedAmount() {
    const control = this.form().get('amount');
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
