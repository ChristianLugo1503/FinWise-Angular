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
import { WeekPickerComponent } from '../../../shared/components/dates/week-picker/week-picker.component';
import { RangePickerComponent } from '../../../shared/components/dates/range-picker/range-picker.component';

@Component({
  selector: 'app-charts',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DonutChartComponent,
    BarChartComponent,
    WeekPickerComponent,
    RangePickerComponent,
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
  public selectedRange: { start: string, end: string } | null = null; //variable para las fechas con rango

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
    this.filterRange(null);
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

  filterRange(Filter:string | null){
    if (Filter) this.activeFilter = Filter;
  
    if(this.selectedRange !== null){
      console.log(this.selectedRange)
      this.transactionsSrv.getTransactionsData().subscribe({ // Suscribirse al Observable de transacciones
        next: (response) => {
          if (response) {
            console.log('Array original',response)

          // ******** FILTRO INICIAL POR CATEGORIA, RANGO DE FECHAS Y MONTOS ******** 
            const { categoriesData, amountsData, datesData } = response.reduce((acc, transaction: any) => {
              const normalizedDbDate = new Date(transaction.date).toISOString().split('T')[0]; // Se normaliza la fecha de la bd
              if (transaction.type !== this.activeTab) return acc; // Se filtra por categoría
              if (normalizedDbDate < this.selectedRange!.start || normalizedDbDate > this.selectedRange!.end) return acc; //filtrar por el rango de fechas
              acc.categoriesData.push(transaction.categoryID.name);
              acc.amountsData.push(transaction.amount);
              acc.datesData.push(normalizedDbDate);
              return acc;
            }, { categoriesData: [], amountsData: [], datesData:[] });
            //console.log('Filtro por categorias, montos y fechas:', categoriesData, amountsData, datesData)
          
          // ********  AGRUPAR Y SUMAR MONTOS POR CATEGORIAS EN TOTAL ******** 
            const categorySums = categoriesData.reduce((acc:any, category:any, index:any) => {
              if (!acc[category]) {
                acc[category] = 0;
              }
              acc[category] += amountsData[index];
              return acc;
            }, {} as Record<string, number>);
            //console.log('Montos agrupados por categoria', categorySums)

          // ********  ENVIAR DATOS A DONUT CHART ******** 
            this.categories = Object.keys(categorySums);
            this.amounts = Object.values(categorySums);

          // ******** AGRUPAR Y SUMAR MONTOS POR CATEGORIA Y FECHA (QUE SEAN DEL MISMO DIA) ******** 
            const categorySumsDate = categoriesData.reduce((acc: any, category: any, index: any) => {
              const date = datesData[index]; // Obtener la fecha correspondiente al índice
              const key = `${category}_${date}`; // Crear una clave única combinando categoría y fecha
              
              // Inicializar acumulador si la clave no existe
              if (!acc[key]) {
                acc[key] = 0;
              }
              
              // Sumar el monto correspondiente
              acc[key] += amountsData[index];
              return acc;
            }, {} as Record<string, number>);
            // Convertir el objeto en un arreglo de objetos
            const categorySumsArray = Object.entries(categorySumsDate).map(([key, amount]) => {
              const [category, date] = key.split('_'); // Dividir la clave en categoría y fecha
              return { category, date, amount };
            });
            console.log('Arreglo con categoría, fecha y monto:', categorySumsArray);            
            
          // LLENAR ARRAY DE FECHAS DEL ***BAR CHART*** CON LAS FECHAS COMPLETAS DEL RANGO 
            this.dates = this.generarFechas();
          
            // Agrupar los datos por categoría y fecha
            this.series = categorySumsArray.reduce((acc: any, { category, date, amount }) => {
              // Verificar si la categoría ya existe en el acumulador
              let categoryEntry = acc.find((entry: any) => entry.name === category);
              if (!categoryEntry) {
                // Si no existe, agregar una nueva entrada para la categoría
                categoryEntry = { name: category, data: new Array(this.dates.length).fill(0) };
                acc.push(categoryEntry);
              }

              // Encontrar el índice de la fecha en this.dates y asignar el monto correspondiente
              const dateIndex = this.dates.indexOf(date);
              if (dateIndex !== -1) {
                categoryEntry.data[dateIndex] = amount;
              }

              return acc;
            }, [] as { name: string, data: number[] }[]);

            console.log('Datos contruido array series', this.series) 
          } 
        },
        error: (error) => console.error('Error al cargar las transacciones del usuario:', error)
      });
    }
  }

  generarFechas(){
    // Generar todas las fechas en el rango de fechas seleccionado
    const startDate = new Date(this.selectedRange!.start);
    const endDate = new Date(this.selectedRange!.end);
    const dateArray: string[] = [];

    // Rellenar el array con fechas
    while (startDate <= endDate) {
      dateArray.push(startDate.toISOString().split('T')[0]);
      startDate.setDate(startDate.getDate() + 1);
    }

    return dateArray;
  }

  filterMonth(){
    this.activeFilter = 'month'
  }

  filterYear(){
    this.activeFilter = 'year'
  }

}
