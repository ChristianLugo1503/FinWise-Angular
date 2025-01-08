import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RecurringPaymentsService } from '../../core/services/recurringPayments/api/recurring-payments.service';
import { CustomCurrencyPipe } from '../../shared/pipes/currency/custom-currency.pipe';
import { AlertRESService } from '../../core/services/alerts/alert-res.service';
import { ModalAddPaymentService } from '../../core/services/recurringPayments/modals/modal-add-payment.service';

@Component({
  selector: 'app-recurring-payments',
  imports: [CommonModule, CustomCurrencyPipe],
  templateUrl: './recurring-payments.component.html',
  styleUrl: './recurring-payments.component.css',
})
export default class RecurringPaymentsComponent {
  activeTab: string = 'Gasto';
  payments: any[] = [];

  constructor(
    private recurrentPaymentsSrv: RecurringPaymentsService,
    private alertRES: AlertRESService,
    private addPaymentModal: ModalAddPaymentService
  ) {
    this.recurrentPaymentsSrv.getPaymentsByUserId().subscribe({
      next: (data) => console.log(data),
      error: (error) => {
        console.error('Error al cargar los pagos recurrentes:', error);
      },
    });
    this.getPaymentsByType();
  }

  getPaymentsByType(): void {
    this.recurrentPaymentsSrv.getRecurringPaymentData().subscribe({
      next: (data) => {
        if (data !== null) {
          //console.log(data);
          this.payments = data
            .filter((data: any) => data.type === this.activeTab)
            .map((data: any) => {
              const blob = this.base64ToBlob(
                data.categoryID.image,
                'image/jpeg'
              );
              data.image = URL.createObjectURL(blob) || null;
              return data;
            });
          console.log(this.payments);
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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.getPaymentsByType();
  }

  nomalizarFecha(date: any) {
    return new Date(date).toISOString().split('T')[0];
  }

  addRecurringPayment(type: String): void {
    this.addPaymentModal.openModal(type);
  }

  deleteBtn(id: number): void {
    this.alertRES
      .openCustomDialog(
        'Advertencia',
        '¿Está seguro que desea eliminar el pago recurrente?'
      )
      .subscribe((result: boolean) => {
        if (result) {
          //console.log('Transacción eliminada');
          //this.deleteTrans(id);
        }
      });
  }

  deleteTrans(transID: number) {
    //console.log('id Transaccion:', transID)
    // this.transactionsSrv.deleteTransaction(transID).subscribe({
    //   next: () => {
    //     this.alert.openCustomDialog(
    //       'Éxito',
    //       'La transacción ha sido eliminada éxitosamente. :)',
    //       'success'
    //     );
    //   },
    //   error: (error) => {
    //     this.alert.openCustomDialog(
    //       'Error',
    //       'La transacción no ha sido eliminada :(',
    //       'error'
    //     );
    //   },
    // });
  }

  editTrans(transaction: any) {
    // this.modalEditTransaction.openModal(transaction);
  }
}
