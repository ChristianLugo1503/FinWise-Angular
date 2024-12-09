import { Component, inject, OnInit, resolveForwardRef, ViewChild } from '@angular/core';
import { DataUserService } from '../../../core/services/dataUser/data-user.service';
import { ModalAddTransactionService } from '../../../core/services/modalAddTransaction/modal-add-transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { TransactionsService } from '../../../core/services/transactions/transactions.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DonutChartComponent } from '../../../shared/components/charts/donut-chart/donut-chart.component';
import { BarChartComponent } from '../../../shared/components/charts/bar-chart/bar-chart.component';
import { WeekPickerComponent } from '../../../shared/components/week-picker/week-picker.component';
import { DateRange } from '@angular/material/datepicker';

@Component({
  selector: 'app-charts',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DonutChartComponent,
    BarChartComponent,
    WeekPickerComponent
  ],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export default class ChartsComponent {
// ************ VARIABLES ************
  private modalSvc = inject(ModalAddTransactionService);
  public currentDate!: string;
  public name: any;
  public activeTab: string = 'Gasto';
  public activeFilter: string = 'day';
  public transactions = false;
  public selectedRange: { start: string, end: string } | null = null;

// ************ DATA DONUT CHART ************
  public categories = ['vacio'];
  public amounts!: number[];
  
// ************ DATA BAR CHART ************
  public series!:any;
  public dates!:any;

// ************** CONSTRUCTOR ************
  constructor(
    private dataUserService: DataUserService,
    private categorieSrv: CategoriesService,
    private transactionsSrv: TransactionsService,
    public dialog: MatDialog
  ) {
    this.getTransactionsByUserId(); // Llamar a getTransactionsByUserId() para cargar datos iniciales
    this.getUserData(); // Cargar datos de usuario
    this.getCategoriesByUserID(); // Cargar categorías de usuario
    this.getCurrentDate(); //obtener fecha
    this.filterDay();  //se llama a filter day ya que es el el filtro inicial
  }
  
// ************** FUNCIONES ************
  setActiveTab(tab: string): void { this.activeTab = tab }

  openCustomDialog(type: string) { this.modalSvc.openModal(type) }

  onDateRangeSelected(dateRange: { start: string, end: string }) {
    this.selectedRange = dateRange;
    this.filterWeek()
    //console.log('Rango recibido del hijo (objeto):', dateRange);
  }
  
  getTransactionsByUserId(){
    this.transactionsSrv.getTransactionsByUserId().subscribe({
      next:() => this.transactions = true,
      error: (error) => console.error('Error al cargar las transacciones iniciales:', error)
    });
  }

  getUserData(){
    this.dataUserService.getUserData().subscribe({
      next: (data) => this.name = data.name,
      error: (error) => console.error(error)
    });
  }

  getCategoriesByUserID(){
    this.categorieSrv.getCategoriesByUserId().subscribe({
      error: (error) => console.error('Error al cargar categorías del usuario:', error)
    });
  }

  getCurrentDate(){
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Ajuste para la zona horaria
    this.currentDate = today.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
  }

  filterDay(): void{
    this.activeFilter = 'day'
    this.transactionsSrv.getTransactionsData().subscribe({ // Suscribirse al Observable de transacciones
      next: (response) => {
        if (response) {
          const { categoriesData, amountsData } = response.reduce((acc, transaction: any) => {
            const normalizedDbDate = new Date(transaction.date).toISOString().split('T')[0]; // Se normaliza la fecha de la bd
            if (transaction.type !== this.activeTab) return acc; // Se filtra por categoría
            if(normalizedDbDate !== this.currentDate) return acc;

            acc.categoriesData.push(transaction.categoryID.name);
            acc.amountsData.push(transaction.amount);
            return acc;
          }, { categoriesData: [], amountsData: [] });
        
          // Agrupar y sumar montos por categoría
          const categorySums = categoriesData.reduce((acc:any, category:any, index:any) => {
            if (!acc[category]) {
              acc[category] = 0;
            }
            acc[category] += amountsData[index];
            return acc;
          }, {} as Record<string, number>);

          // Convertir las claves y valores del objeto en arrays separados
          this.categories = Object.keys(categorySums);
          this.amounts = Object.values(categorySums);

          // Construir la serie de datos con categorías y montos
          this.series = this.categories.map((categoria: string, index: number) => ({
            name: categoria,
            data: [this.amounts[index]]
          }));

          this.dates = [this.currentDate]
        } 
      },
      error: (error) => console.error('Error al cargar las transacciones del usuario:', error)
    });
  }

  filterWeek(){
    this.activeFilter = 'week'
    console.log('rango de fecha para la semana:',this.selectedRange)
    if(this.selectedRange !== null){
      this.transactionsSrv.getTransactionsData().subscribe({ // Suscribirse al Observable de transacciones
        next: (response) => {
          if (response) {
            const { categoriesData, amountsData } = response.reduce((acc, transaction: any) => {
              const normalizedDbDate = new Date(transaction.date).toISOString().split('T')[0]; // Se normaliza la fecha de la bd
              if (transaction.type !== this.activeTab) return acc; // Se filtra por categoría
              if(normalizedDbDate !== this.currentDate) return acc; //filtrar por el rango de fechas
              
              acc.categoriesData.push(transaction.categoryID.name);
              acc.amountsData.push(transaction.amount);
              return acc;
            }, { categoriesData: [], amountsData: [] });
          
            // Agrupar y sumar montos por categoría
            const categorySums = categoriesData.reduce((acc:any, category:any, index:any) => {
              if (!acc[category]) {
                acc[category] = 0;
              }
              acc[category] += amountsData[index];
              return acc;
            }, {} as Record<string, number>);

            // Convertir las claves y valores del objeto en arrays separados
            this.categories = Object.keys(categorySums);
            this.amounts = Object.values(categorySums);

            // Construir la serie de datos con categorías y montos
            this.series = this.categories.map((categoria: string, index: number) => ({
              name: categoria,
              data: [this.amounts[index]]
            }));

            this.dates = [this.currentDate]
          } 
        },
        error: (error) => console.error('Error al cargar las transacciones del usuario:', error)
      });
    }
  }

  filterMonth(){
    this.activeFilter = 'month'
  }

  filterYear(){
    this.activeFilter = 'year'
  }

}
