import { Component, inject, ViewChild } from '@angular/core';
import { DataUserService } from '../../../core/services/dataUser/data-user.service';
import { CommonModule } from '@angular/common';
import { ModalAddTransactionService } from '../../../core/services/modalAddTransaction/modal-add-transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from '../../../core/services/categories/categories.service';

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
} from "ng-apexcharts";

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
  labels: any;
  legend: ApexLegend;
};

@Component({
    selector: 'app-charts',
    imports: [
      CommonModule,
      NgApexchartsModule
    ],
    templateUrl: './charts.component.html',
    styleUrl: './charts.component.css'
})
export default class ChartsComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chart2") chart2!: ChartComponent;
  public chartOptions2: Partial<ChartOptions2>;

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

    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: "donut"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              show: false,
              position: "bottom"
            }
          }
        }
      ],
      legend:{
        show: false
      }
    };

    this.chartOptions2 = {
      series: [
        {
          name: "PRODUCT A",
          data: [44, 55, 41, 67, 22, 43]
        },
        {
          name: "PRODUCT B",
          data: [13, 23, 20, 8, 13, 27]
        },
        {
          name: "PRODUCT C",
          data: [11, 17, 15, 15, 21, 14]
        },
        {
          name: "PRODUCT D",
          data: [21, 7, 25, 13, 22, 8]
        }
      ],
      chart: {
        type: "bar",
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
              position: "bottom",
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
        type: "category",
        categories: [
          "01/2011",
          "02/2011",
          "03/2011",
          "04/2011",
          "05/2011",
          "06/2011"
        ]
      },
      legend: {
        show:false,
        position: "bottom"
      },
      fill: {
        opacity: 1
      }
    };

  };
  
  setActiveTab(tab: string): void {
    this.activeTab = tab; 
  }

  //Abrir modal para registrar ingresos o gastos (transactions)
  openCustomDialog(type:string){
    this.modalSvc.openModal(type,'adios', 'success');
  }

}
