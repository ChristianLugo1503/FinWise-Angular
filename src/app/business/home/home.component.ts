import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import ChartsComponent from './charts/charts.component';
import ExpensesByCategoryComponent from './expenses-by-category/expenses-by-category.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ChartsComponent,
    ExpensesByCategoryComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {
  
}
