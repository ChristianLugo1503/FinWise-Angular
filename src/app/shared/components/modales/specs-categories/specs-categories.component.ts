import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TransactionsService } from '../../../../core/services/transactions/transactions.service';
import { CommonModule } from '@angular/common';
import { CustomCurrencyPipe } from '../../../pipes/currency/custom-currency.pipe';
import { AlertRESComponent } from '../alert-res/alert-res.component';
import { AlertRESService } from '../../../../core/services/alertRES/alert-res.service';
import { AlertComponent } from '../alert/alert.component';
import { ModalAlertService } from '../../../../core/services/alert/modal-alert.service';
import { ModalEditTransactionService } from '../../../../core/services/modalEditTransaction/modal-edit-transaction.service';

@Component({
  selector: 'app-specs-categories',
  imports: [
    CommonModule
],
  templateUrl: './specs-categories.component.html',
  styleUrl: './specs-categories.component.css'
})
export class SpecsCategoriesComponent implements OnInit{
  public transactions: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<SpecsCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, img: string, transactionsID: any },
    public transactionsSrv : TransactionsService,
    public alertRES : AlertRESService,
    public alert: ModalAlertService,
    public dialog: MatDialog,
    public modalEditTransaction: ModalEditTransactionService,
  ){}

  ngOnInit(): void {
    this.transactionsSrv.getTransactionsData().subscribe((allTransactions:any) =>{
      if(allTransactions !== null){
        this.transactions = allTransactions.filter((transaction:any) => {
          if (!this.data.transactionsID.includes(transaction.id)){return false}
          if(transaction.categoryID.name !== this.data.title){return false}
          return true;
        })
        console.log('Transaction', this.transactions)
      };
    })
  }

  nomalizarFecha(date:any){
    return new Date(date).toISOString().split('T')[0];
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  deleteBtn(id: number): void {
    this.alertRES.openCustomDialog('Advertencia', '¿Está seguro que desea eliminar la transacción?')
      .subscribe((result: boolean) => {
        if (result) {
          //console.log('Transacción eliminada');
          this.deleteTrans(id);
        } 
      });
  }

  deleteTrans(transID: number){
    console.log('id Transaccion:', transID)
    this.transactionsSrv.deleteTransaction(transID).subscribe({
      next: () =>{
        this.alert.openCustomDialog('Éxito', 'La transacción ha sido eliminada éxitosamente. :)', 'success');
      },
      error:(error) =>{
        this.alert.openCustomDialog('Error', 'La transacción no ha sido eliminada :(', 'error');
      }
    })
  }

  editTrans(transaction: any){
    this.modalEditTransaction.openModal(transaction)
  }
}
