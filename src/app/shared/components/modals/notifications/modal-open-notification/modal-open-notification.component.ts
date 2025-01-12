import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { CategoriesService } from '../../../../../core/services/categories/api/categories.service';
import { ModalAddSavingComponent } from '../../savings/modal-add-saving/modal-add-saving.component';
import { NotificationsService } from '../../../../../core/services/notifications/api/notifications.service';

@Component({
  selector: 'app-modal-open-notification',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-open-notification.component.html',
  styleUrl: './modal-open-notification.component.css',
})
export class ModalOpenNotificationComponent {
  //MODAL
  constructor(
    public dialogRef: MatDialogRef<ModalAddSavingComponent>,
    @Inject(MAT_DIALOG_DATA) public notification: any,
    private notificationsSrv: NotificationsService
  ) {
    notificationsSrv.editReadStatus(notification.id, true).subscribe({
      error: (error) => {
        console.error(
          'Error al actualizar el estado de la notificacion.',
          error
        );
      },
    });
  }

  ngOnInit(): void {
    console.log(this.notification);
  }

  nomalizarFecha(date: any): string {
    const normalizedDate = new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return normalizedDate;
  }

  acceptNotification(id: number) {}
  rejectNotification(id: number) {}

  getImageType(type: string): string {
    switch (type) {
      case 'grupo_pago':
        return 'groups.png';
        break;
      case 'ahorro':
        return 'savings.png';
        break;
      case 'pago_recurrente':
        return 'payment.png';
        break;
      case 'contribucion':
        return 'contribution.png';
        break;
      default:
        return 'desconocido.png';
        break;
    }
  }

  getNameType(type: string): string {
    switch (type) {
      case 'grupo_pago':
        return 'Grupos de pago';
        break;
      case 'ahorro':
        return 'Ahorros';
        break;
      case 'pago_recurrente':
        return 'Pagos Recurrentes';
        break;
      case 'contribucion':
        return 'Contribuciones';
        break;
      default:
        return 'Desconocido';
        break;
    }
  }
  closeModal(): void {
    // Limpiar las categorías y cualquier dato asociado
    this.dialogRef.close();
  }
}
