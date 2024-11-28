import { Component, inject } from '@angular/core';
import { DataUserService } from '../../../core/services/dataUser/data-user.service';
import { CommonModule } from '@angular/common';
import { ModalAddTransactionService } from '../../../core/services/modalAddTransaction/modal-add-transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from '../../../core/services/categories/categories.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export default class ChartsComponent {

  private modalSvc = inject(ModalAddTransactionService)
  activeTab: string = 'Gasto'; 
  name: any;
  user: any;
  
  constructor(
    private dataUserService: DataUserService,
    private categorieSrv: CategoriesService,
    public dialog: MatDialog
  ){
    this.dataUserService.getUserData().subscribe({
      next: data =>{
        this.name = data.name;
        console.log('name',this.name)
      },
      error: error => {
        console.error(error);
      }
    })
    this.categorieSrv.getCategoriesByUserId().subscribe({
      next: (response) => {
        console.log('Categorias del usuario cargadas:', response);
      },
      error: (error) => {
        console.error('Error al cargar categorias del usuario:', error);
      },
    });
  };
  
  setActiveTab(tab: string): void {
    this.activeTab = tab; 
  }

  //Abrir modal para registrar ingresos o gastos (transactions)
  openCustomDialog(type:string){
    this.modalSvc.openModal(type,'adios', 'success');
  }

}
