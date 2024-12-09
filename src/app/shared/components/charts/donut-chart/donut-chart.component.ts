import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexPlotOptions,
  ApexResponsive,
  ApexLegend,
  ApexNonAxisChartSeries,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  labels: any;
  legend: ApexLegend;
};

@Component({
  selector: 'app-donut-chart',
  imports: [
    NgApexchartsModule,
    CommonModule
  ],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.css'
})
export class DonutChartComponent implements OnChanges{
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  @Input() categories!: string[];
  @Input() amounts!: number[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] || changes['amounts']) {
      this.renderChart(); // Renderizar nuevamente la gráfica
    }
  }

  renderChart(){
    if (this.amounts.length === 0) {
      this.amounts = [0]
    }

    //console.log('Valores de amounts:', this.amounts);
    // console.log(
    //   'Tipos de datos en amounts:',
    //   this.amounts.map((amount) => typeof amount)
    // );
      
    //console.log('categories donut', this.categories)
    //console.log('amounts donut', this.amounts)
    
    // Configurar las opciones de la gráfica de donut
    this.chartOptions = {
      series: this.amounts,
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
                label: (this.amounts[0] == 0 ? 'Sin datos' : 'Total'),
                fontSize: '2rem',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#ffffff'
              },
              value:{
                show: (this.amounts[0] !== 0),
                color: '#ffffff'
              }
            }
          }
        }
      },
      labels: this.categories,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              show: true,
              position: 'bottom'
            }
          }
        }
      ],
      legend: {
        show: true,
        position: 'bottom',
        labels: {
          colors: '#ffffff',
          useSeriesColors: false
        },
      }
    };
  }
}
