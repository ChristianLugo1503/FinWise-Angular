import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertRESService } from '../../core/services/alerts/alert-res.service';
import { ModalAlertService } from '../../core/services/alerts/modal-alert.service';
import { CustomCurrencyPipe } from '../../shared/pipes/currency/custom-currency.pipe';
import { SavingsService } from '../../core/services/savings/api/savings.service';
import { ModalAddSavingService } from '../../core/services/savings/modals/modal-add-saving.service';
import { ModalEditSavingService } from '../../core/services/savings/modals/modal-edit-saving.service';
import { NotificationsService } from '../../core/services/notifications/api/notifications.service';
import { TruncatePipe } from '../../shared/pipes/truncateText/truncate.pipe';
import { ModalOpenNotificationComponent } from '../../shared/components/modals/notifications/modal-open-notification/modal-open-notification.component';
import { ModalOpenNotificationService } from '../../core/services/notifications/modals/modal-open-notification.service';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, FormsModule, TruncatePipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export default class NotificationsComponent {
  notifications: any[] = [];
  searchText: string = '';

  constructor(
    private notificationsSrv: NotificationsService,
    private addSavingsModal: ModalAddSavingService,
    private openNotificationModal: ModalOpenNotificationService,
    private alertRES: AlertRESService,
    private alert: ModalAlertService
  ) {
    this.notificationsSrv.getNotificationsByUserId().subscribe({
      next: (data) => console.log(data),
      error: (error) => {
        console.error('Error al cargar las notificaciones:', error);
      },
    });
    this.getNotificationsByType();
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

  get filteredNotifications(): any[] {
    const lowerSearchText = this.searchText.toLowerCase();
    return this.notifications.filter(
      (payment) =>
        payment.type.toLowerCase().includes(lowerSearchText) ||
        payment.message.toLowerCase().includes(lowerSearchText)
    );
  }

  getNotificationsByType(): void {
    this.notificationsSrv.getNotificationsData().subscribe({
      next: (data) => {
        if (data !== null) {
          this.notifications = data;
          //console.log('Savigs', this.notifications);
        }
      },
      error: (error) => {
        console.error('Error al cargar los pagos recurrentes:', error);
      },
    });
  }

  nomalizarFecha(date: any): string {
    const normalizedDate = new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return normalizedDate;
  }

  addRecurringSaving(): void {
    this.addSavingsModal.openModal();
  }

  deleteBtn(id: number): void {
    this.alertRES
      .openCustomDialog(
        'Advertencia',
        '¿Está seguro que desea eliminar esta notificación?'
      )
      .subscribe((result: boolean) => {
        if (result) {
          this.notificationsSrv.deleteNotification(id).subscribe({
            next: () => {
              this.alert.openCustomDialog(
                'Éxito',
                'Notificación eliminada correctamente',
                'success'
              );
            },
            error: (error) => {
              console.error('Error al eliminar la notificación.', error);
              this.alert.openCustomDialog(
                'Error',
                'Error al eliminar la notificación.',
                'error'
              );
            },
          });
        }
      });
  }

  removeLineBreaks(message: string): string {
    return message.replace(/<br\s*\/?>/gi, ' '); // Reemplaza <br> por un espacio.
  }

  changeStatus(id: number, actualStatus: boolean): void {
    // console.log('Cambiar estado', id, !actualStatus);
    // this.notificationsSrv.editSavingStatus(id, !actualStatus).subscribe({
    //   next: () => {
    //     console.log('Estado actualizado correctamente:');
    //     this.alert.openCustomDialog(
    //       'Éxito',
    //       'Estado del pago recurrente actualizado correctamente',
    //       'success'
    //     );
    //   },
    //   error: (error) => {
    //     console.error(
    //       'Error al actualizar el estado del pago recurrente:',
    //       error
    //     );
    //     this.alert.openCustomDialog(
    //       'Error',
    //       'Error al actualizar el estado del pago recurrente',
    //       'error'
    //     );
    //   },
    // });
  }

  viewNotification(notification: any) {
    this.openNotificationModal.openModal(notification);
  }
}
