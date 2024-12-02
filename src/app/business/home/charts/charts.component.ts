import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { DataUserService } from '../../../core/services/dataUser/data-user.service';
import { ModalAddTransactionService } from '../../../core/services/modalAddTransaction/modal-add-transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { TransactionsService } from '../../../core/services/transactions/transactions.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexNonAxisChartSeries,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

export type ChartOptions2 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  labels: any;
  legend: ApexLegend;
};

@Component({
  selector: 'app-charts',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export default class ChartsComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  @ViewChild('chart2') chart2!: ChartComponent;
  public chartOptions2!: Partial<ChartOptions2>;

  private modalSvc = inject(ModalAddTransactionService);
  activeTab: string = 'Gasto';
  name: any;
  user: any;

  constructor(
    private dataUserService: DataUserService,
    private categorieSrv: CategoriesService,
    private transactionsSrv: TransactionsService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // Cargar datos de usuario
    this.dataUserService.getUserData().subscribe({
      next: (data) => {
        this.name = data.name;
        console.log('Nombre del usuario:', this.name);
      },
      error: (error) => {
        console.error(error);
      }
    });

    // Cargar categorías de usuario
    this.categorieSrv.getCategoriesByUserId().subscribe({
      next: (response) => {
        console.log('Categorías del usuario cargadas:', response);
      },
      error: (error) => {
        console.error('Error al cargar categorías del usuario:', error);
      }
    });

    // Suscribirse al Observable de transacciones
    this.transactionsSrv.getTransactionsData().subscribe({
      next: (response) => {
        if (response) {
          console.log('Transacciones del usuario cargadas:', response);

          // Procesar los datos de las transacciones
          const categories = response.map((transaction: any) => transaction.categoryID.name);
          const amounts = response.map((transaction: any) => transaction.amount);

          console.log('Array de categorías', categories);
          console.log('Array de montos', amounts);

          // Agrupar los montos por categoría
          const groupedData = response.reduce((acc: { [x: string]: any[] }, transaction: any) => {
            const categoryName = transaction.categoryID.name;
            const amount = transaction.amount;

            if (!acc[categoryName]) {
              acc[categoryName] = [];
            }
            acc[categoryName].push(amount);

            return acc;
          }, {} as Record<string, number[]>);

          // Convertir el objeto de datos agrupados en un array de objetos
          const seriesData = Object.keys(groupedData).map(category => ({
            name: category,
            data: groupedData[category]
          }));

          // Configurar las opciones de la gráfica de donut
          this.chartOptions = {
            series: amounts,
            chart: {
              type: 'donut'
            },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      showAlways: true,
                      label: 'Total',
                      fontSize: '2rem',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 600,
                      color: '#ffffff'
                    },
                    value:{
                      show: true,
                      color: '#ffffff'
                    }
                  }
                }
              }
            },
            labels: categories,
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    show: false,
                    position: 'bottom'
                  }
                }
              }
            ],
            legend: {
              show: false
            }
          };

          // Configurar las opciones de la gráfica de barras
          this.chartOptions2 = {
            series: seriesData,
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              toolbar: {
                show: true
              },
              zoom: {
                enabled: true
              }
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                  }
                }
              }
            ],
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
            xaxis: {
              type: 'category',
              categories: [
                '01/2011',
                '02/2011',
                '03/2011',
                '04/2011',
                '05/2011',
                '06/2011'
              ]
            },
            legend: {
              show: false,
              position: 'bottom'
            },
            fill: {
              opacity: 1
            }
          };
        }
      },
      error: (error) => {
        console.error('Error al cargar las transacciones del usuario:', error);
      }
    });

    // Llamar a getTransactionsByUserId() para cargar datos iniciales
    this.transactionsSrv.getTransactionsByUserId().subscribe({
      next: () => {
        // El Observable ya maneja la actualización de datos
      },
      error: (error) => {
        console.error('Error al cargar las transacciones iniciales:', error);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Abrir modal para registrar ingresos o gastos (transacciones)
  openCustomDialog(type: string) {
    this.modalSvc.openModal(type, 'adios', 'success');
  }
}
