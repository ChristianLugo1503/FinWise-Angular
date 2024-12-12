import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionsService } from '../../../../core/services/transactions/transactions.service';
import { CommonModule } from '@angular/common';
import { CustomCurrencyPipe } from '../../../pipes/currency/custom-currency.pipe';

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

}
