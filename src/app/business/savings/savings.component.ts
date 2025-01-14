import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertRESService } from '../../core/services/alerts/alert-res.service';
import { ModalAlertService } from '../../core/services/alerts/modal-alert.service';
import { CustomCurrencyPipe } from '../../shared/pipes/currency/custom-currency.pipe';
import { SavingsService } from '../../core/services/savings/api/savings.service';
import { ModalAddSavingService } from '../../core/services/savings/modals/modal-add-saving.service';
import { ModalEditSavingService } from '../../core/services/savings/modals/modal-edit-saving.service';
import { ModalOpenSavingComponent } from '../../shared/components/modals/savings/modal-open-saving/modal-open-saving.component';
import { ModalOpenSavingService } from '../../core/services/savings/modals/modal-open-saving.service';

@Component({
  selector: 'app-savings',
  imports: [CommonModule, CustomCurrencyPipe, FormsModule],
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.css',
})
export default class SavingsComponent {
  savings: any[] = [];
  searchText: string = '';

  constructor(
    private savingSrv: SavingsService,
    private alertRES: AlertRESService,
    private alert: ModalAlertService,
    private addSavingsModal: ModalAddSavingService,
    private editSavingModal: ModalEditSavingService,
    private openSavingModal: ModalOpenSavingService
  ) {
    this.savingSrv.getSavingsByUserId().subscribe({
      // next: (data) => console.log(data),
      error: (error) => {
        console.error('Error al cargar los pagos recurrentes:', error);
      },
    });
    this.getSavingsByType();
  }

  get filteredSavings(): any[] {
    const lowerSearchText = this.searchText.toLowerCase();
    return this.savings.filter(
      (payment) =>
        payment.name.toLowerCase().includes(lowerSearchText) ||
        payment.comment.toLowerCase().includes(lowerSearchText)
    );
  }

  getSavingsByType(): void {
    this.savingSrv.getSavingsData().subscribe({
      next: (data) => {
        if (data !== null) {
          this.savings = data;
          //console.log('Savigs', this.savings);
        }
      },
      error: (error) => {
        console.error('Error al cargar los pagos recurrentes:', error);
      },
    });
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteArray], { type: mimeType });
  }

  nomalizarFecha(date: any) {
    return new Date(date).toISOString().split('T')[0];
  }

  addRecurringSaving(): void {
    this.addSavingsModal.openModal();
  }

  deleteBtn(id: number): void {
    this.alertRES
      .openCustomDialog(
        'Advertencia',
        '¿Está seguro que desea eliminar el pago recurrente?'
      )
      .subscribe((result: boolean) => {
        if (result) {
          this.savingSrv.deleteSaving(id).subscribe({
            next: () => {
              this.alert.openCustomDialog(
                'Éxito',
                'Pago recurrente eliminado correctamente',
                'success'
              );
            },
            error: (error) => {
              console.error('Error al eliminar el pago recurrente:', error);
              this.alert.openCustomDialog(
                'Error',
                'Error al eliminar el pago recurrente',
                'error'
              );
            },
          });
        }
      });
  }

  changeStatus(id: number, actualStatus: boolean): void {
    // console.log('Cambiar estado', id, !actualStatus);
    this.savingSrv.editSavingStatus(id, !actualStatus).subscribe({
      next: () => {
        // console.log('Estado actualizado correctamente:');
        this.alert.openCustomDialog(
          'Éxito',
          'Estado del pago recurrente actualizado correctamente',
          'success'
        );
      },
      error: (error) => {
        console.error(
          'Error al actualizar el estado del pago recurrente:',
          error
        );
        this.alert.openCustomDialog(
          'Error',
          'Error al actualizar el estado del pago recurrente',
          'error'
        );
      },
    });
  }

  openSaving(saving: any) {
    this.openSavingModal.openModal(saving);
  }

  editSaving(saving: any) {
    this.editSavingModal.openModal(saving);
  }
}
