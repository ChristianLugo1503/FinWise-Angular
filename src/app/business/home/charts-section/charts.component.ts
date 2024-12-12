import { Component, EventEmitter, inject, OnInit, Output, resolveForwardRef, ViewChild } from '@angular/core';
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
import { MonthPickerComponent } from '../../../shared/components/dates/month-picker/month-picker.component';
import { YearPickerComponent } from '../../../shared/components/dates/year-picker/year-picker.component';
import { DayPickerComponent } from '../../../shared/components/dates/day-picker/day-picker.component';
import { BehaviorSubject } from 'rxjs';
import { DataDonutService } from '../../../core/services/dataDonut/data-donut.service';

@Component({
  selector: 'app-charts',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DonutChartComponent,
    BarChartComponent,
    DayPickerComponent,
    WeekPickerComponent,
    MonthPickerComponent,
    YearPickerComponent,
    RangePickerComponent,
  ],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export default class ChartsComponent implements OnInit {
// ************ VARIABLES ************
  private modalSvc = inject(ModalAddTransactionService);
  public name: any;
  public activeTab: string = 'Gasto';
  public activeFilter: string = 'day';
  public transactions = false;
  public selectedRange: { start: string, end: string } | null = null; //variable para las fechas con rango
  public selectedYear! : number;
  public selectedDay! : string;

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
    private dataDonutSrv: DataDonutService,
    public dialog: MatDialog
  ) {
    this.getUserData()
    
  }
  
// ************** FUNCIONES ************
  ngOnInit(): void {
    //this.getUserData(); // Cargar datos de usuario
  }

  getUserData(){
    this.dataUserService.loadUserData().subscribe({
      next: (data) => {
        if (data !== null) {
          this.name = data.name
          this.getTransactionsByUserId(); // Llamar a getTransactionsByUserId() para cargar datos iniciales
          this.getCategoriesByUserID(); // Cargar categorías de usuario
          this.filterDay();  //se llama a filter day ya que es el el filtro inicial
        }
      },
      error: (error) => console.error(error)
    });
  }

  setActiveTab(tab: string): void { 
    this.activeTab = tab 
    // this.getTransactionsByUserId(); // Llamar a getTransactionsByUserId() para cargar datos iniciales
    // this.getUserData(); // Cargar datos de usuario
    // this.getCategoriesByUserID(); // Cargar categorías de usuario
    switch (this.activeFilter) {
      case 'day':
        this.filterDay();
        break;
      case 'year':
        this.filterYear();
        break;
      case this.activeFilter:
        this.filterWithRange(this.activeFilter);
        break;
    }
  }

  openCustomDialog(type: string) { this.modalSvc.openModal(type) }

  onDaySelected(day:any){
    this.selectedDay = day;
    this.filterDay();
  }

  onDateRangeSelected(dateRange: { start: string, end: string }) {
    this.selectedRange = dateRange;
    this.filterWithRange(null);
  }

  onYearSelected(year: number) {
    this.selectedYear = year;
    this.filterYear();
  }
  
  getTransactionsByUserId(){
    this.transactionsSrv.getTransactionsByUserId().subscribe({
      next:(data) => {
        this.transactions = true
      },
      error: (error) => console.error('Error al cargar las transacciones iniciales:', error)
    });
  }

  getCategoriesByUserID(){
    this.categorieSrv.getCategoriesByUserId().subscribe({
      error: (error) => console.error('Error al cargar categorías del usuario:', error)
    });
  }

  filterDay(): void{
    this.activeFilter = 'day'
    if (this.selectedDay) {
      this.transactionsSrv.getTransactionsData().subscribe({ // Suscribirse al Observable de transacciones
        next: (response) => {
          if (response) {
            const { categoriesData, amountsData, transactionID } = response.reduce((acc, transaction: any) => {
              const normalizedDbDate = new Date(transaction.date).toISOString().split('T')[0]; // Se normaliza la fecha de la bd
              if (transaction.type !== this.activeTab) return acc; // Se filtra por categoría
              if(normalizedDbDate !== this.selectedDay) return acc;

              acc.categoriesData.push(transaction.categoryID.name);
              acc.amountsData.push(transaction.amount);
              acc.transactionID.push(transaction.id)
              return acc;
            }, { categoriesData: [], amountsData: [], transactionID: [] });
          
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

            let datos = {
              transactionsIDs: transactionID,
              categories: this.categories,
              amounts: this.amounts
            }

            this.dataDonutSrv.setData(datos);

            // Construir la serie de datos con categorías y montos
            this.series = this.categories.map((categoria: string, index: number) => ({
              name: categoria,
              data: [this.amounts[index]]
            }));

            this.dates = [this.selectedDay]
          } 
        },
        error: (error) => console.error('Error al cargar las transacciones del usuario:', error)
      });
    }
  }

  filterWithRange(Filter:string | null){
    if (Filter) this.activeFilter = Filter;
  
    if(this.selectedRange !== null){
      this.transactionsSrv.getTransactionsData().subscribe({ // Suscribirse al Observable de transacciones
        next: (response) => {
          if (response) {

          // ******** FILTRO INICIAL POR CATEGORIA, RANGO DE FECHAS Y MONTOS ******** 
            const { categoriesData, amountsData, datesData,transactionID } = response.reduce((acc, transaction: any) => {
              const normalizedDbDate = new Date(transaction.date).toISOString().split('T')[0]; // Se normaliza la fecha de la bd
              if (transaction.type !== this.activeTab) return acc; // Se filtra por categoría
              if (normalizedDbDate < this.selectedRange!.start || normalizedDbDate > this.selectedRange!.end) return acc; //filtrar por el rango de fechas
              acc.categoriesData.push(transaction.categoryID.name);
              acc.amountsData.push(transaction.amount);
              acc.datesData.push(normalizedDbDate);
              acc.transactionID.push(transaction.id)
              return acc;
            }, { categoriesData: [], amountsData: [], datesData:[], transactionID:[] });
          
          // ********  AGRUPAR Y SUMAR MONTOS POR CATEGORIAS EN TOTAL ******** 
            const categorySums = categoriesData.reduce((acc:any, category:any, index:any) => {
              if (!acc[category]) {
                acc[category] = 0;
              }
              acc[category] += amountsData[index];
              return acc;
            }, {} as Record<string, number>);

          // ********  ENVIAR DATOS A DONUT CHART ******** 
            this.categories = Object.keys(categorySums);
            this.amounts = Object.values(categorySums);

            let datos = {
              transactionsIDs: transactionID,
              categories: this.categories,
              amounts: this.amounts
            }

            this.dataDonutSrv.setData(datos);

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

  filterYear() {
    this.activeFilter = 'year';
    if (this.selectedYear !== undefined) {
      this.transactionsSrv.getTransactionsData().subscribe({
        next: (response) => {
          if (response) {
            this.series = [];
            this.dates = [
              'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
              'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];  
            // ******** FILTRO INICIAL POR CATEGORIA Y AÑO ******** 
            const { categoriesData, amountsData, datesData, transactionID} = response.reduce((acc, transaction: any) => {
              const normalizedDbDate = new Date(transaction.date);
              const year = normalizedDbDate.getFullYear(); // Año de la transacción

              if (transaction.type !== this.activeTab) {
                return acc; // Se filtra por tipo de transacción
              }
  
              // Filtrar por el año seleccionado
              if (year !== this.selectedYear) {
                return acc;
              }
  
              acc.categoriesData.push(transaction.categoryID.name);
              acc.amountsData.push(transaction.amount);
              acc.datesData.push(normalizedDbDate);
              acc.datesData.push(transaction.id);
              return acc;
            }, { categoriesData: [], amountsData: [], datesData: [] , transactionID: []});

    
            // ******** AGRUPAR Y SUMAR MONTOS POR CATEGORÍAS EN TOTAL ******** 
            const categorySums = categoriesData.reduce((acc: any, category: any, index: any) => {
              if (!acc[category]) {
                acc[category] = 0;
              }
              acc[category] += amountsData[index];
              return acc;
            }, {} as Record<string, number>);
    
            // ******** ENVIAR DATOS A DONUT CHART ******** 
            this.categories = Object.keys(categorySums);
            this.amounts = Object.values(categorySums);

            let datos = {
              transactionsIDs: transactionID,
              categories: this.categories,
              amounts: this.amounts
            }

            this.dataDonutSrv.setData(datos);
  
            // ******** AGRUPAR Y SUMAR MONTOS POR CATEGORÍA Y MES ******** 
            const categorySumsMonth = categoriesData.reduce((acc: any, category: any, index: any) => {
              const date = datesData[index];
              const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`; // Formato 'YYYY-MM'
  
              const key = `${category}_${monthYear}`; // Crear una clave única combinando categoría y mes/año
  
              // Inicializar acumulador si la clave no existe
              if (!acc[key]) {
                acc[key] = 0;
              }
  
              // Sumar el monto correspondiente
              acc[key] += amountsData[index];
              return acc;
            }, {} as Record<string, number>);
  
            // Convertir el objeto en un arreglo de objetos
            const categorySumsArrayMonth = Object.entries(categorySumsMonth).map(([key, amount]) => {
              const [category, monthYear] = key.split('_'); // Dividir la clave en categoría y mes/año
              const [year, month] = monthYear.split('-').map(Number);
              return { category, year, month: month - 1, amount }; // Mes ajustado (0-11)
            });
  
            // ******** LLENAR ARRAY DE MESES PARA EL GRÁFICO ******** 
            this.series = this.categories.map(category => {
              const data = new Array(12).fill(0); // 12 meses por categoría
              categorySumsArrayMonth.forEach(({ category: cat, month, amount }) => {
                if (cat === category) {
                  data[month] = amount;
                }
              });
  
              return { name: category, data };
            });
  
          }
        },
        error: (error) => console.error('Error al cargar las transacciones del usuario:', error)
      });
    }
  }
  
  // Método para generar todos los meses del año en formato 'YYYY-MM'
  generarMeses(): string[] {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(2024, i).toISOString().split('T')[0]; // Usa un año fijo o `this.selectedYear`
      months.push(month);
    }
    return months;
  }
  

  

}
