import { Component, Input, OnInit } from '@angular/core';
import { TransactionsService } from '../../../core/services/transactions/transactions.service';
import { CommonModule } from '@angular/common';
import { DataDonutService } from '../../../core/services/dataDonut/data-donut.service';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { ModalSpecsCategoriesService } from '../../../core/services/modalSpecsCategories/modal-specs-categories.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-expenses-by-category',
    imports: [
        CommonModule,
        FormsModule,
    ReactiveFormsModule,
    ],
    templateUrl: './expenses-by-category.component.html',
    styleUrl: './expenses-by-category.component.css'
})
export default class ExpensesByCategoryComponent implements OnInit {
    public categoriesData: string[] = [];
    public amountsData: number[] = [];
    public balanceGen: number = 0;
    public transactionsIDs: any;
    public categoriesWithImagesAndAmounts: any[] = []; // Objeto final combinado

    constructor(
        private transactionsSrv: TransactionsService,
        private modalSrv: ModalSpecsCategoriesService,
        private dataDonutSrv: DataDonutService,
        private categoriesSrv: CategoriesService
    ) {
        transactionsSrv.getTransactionsData().subscribe({
            next: (data) => {
                if (data !== null) {
                    this.balanceGen = this.calculateBalance(data);
                }
            }
        });
    }

    ngOnInit(): void {
        // Suscribirse a los datos del servicio DataDonut
        this.dataDonutSrv.data$.subscribe(data => {
            if (data !== null) {
                this.categoriesData = data.categories;
                this.amountsData = data.amounts;
                this.transactionsIDs = data.transactionsIDs;
                console.log('DATOS COMPLETOS', this.categoriesData, this.amountsData, this,this.transactionsIDs)
                
                // Obtener la lista completa de categorías desde el servicio
                this.categoriesSrv.getCategoriesData().subscribe((allCategories: any[]) => {
                    this.categoriesWithImagesAndAmounts = this.categoriesData.map((categoryName, index) => {
                        const matchedCategory = allCategories.find(cat => cat.name === categoryName);
                        const blob = this.base64ToBlob(matchedCategory.image, 'image/jpeg')
                        return {
                            name: categoryName,
                            amount: this.amountsData[index] || 0,
                            image: matchedCategory ? URL.createObjectURL(blob) : null
                        };
                    });
                    
                    // Ordenar por montos de mayor a menor
                    this.categoriesWithImagesAndAmounts.sort((a, b) => b.amount - a.amount);
                    
                    console.log('Objeto combinado y ordenado:', this.categoriesWithImagesAndAmounts);
                });
            }
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

    calculateBalance(transactions: any): number {
        return transactions.reduce((balance: any, transaction: any) => {
            if (transaction.type === "Ingreso") {
                return balance + transaction.amount;
            } else if (transaction.type === "Gasto") {
                return balance - transaction.amount;
            }
            return balance;
        }, 0);
    }

    openCustomModal(type: string, img:string) { this.modalSrv.openModal(type, img) }
}
