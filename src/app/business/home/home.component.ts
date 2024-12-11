import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import ChartsComponent from './charts-section/charts.component';
import ExpensesByCategoryComponent from './expenses-by-category/expenses-by-category.component';
import { DataUserService } from '../../core/services/dataUser/data-user.service';

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        ChartsComponent,
        ExpensesByCategoryComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export default class HomeComponent {
  constructor(
    dataUserService : DataUserService
  ){
    // dataUserService.loadUserData().subscribe({
    //     next: (response) => {
    //       console.log('Datos del usuario cargados:', response);
    //     },
    //     error: (error) => {
    //       console.error('Error al cargar datos del usuario:', error);
    //     },
    //   });
  }

  
}
