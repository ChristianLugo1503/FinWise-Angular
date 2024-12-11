import { CommonModule } from '@angular/common';
import { Component, Input, input, OnChanges, OnInit, ViewChild } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CategoriesService } from '../../../../core/services/categories/categories.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
  colors:any;
};

@Component({
  selector: 'app-bar-chart',
  imports: [
    NgApexchartsModule,
    CommonModule
  ],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnChanges {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  @Input() series:any;
  @Input() dates:any;

  constructor(private categoriesSrv: CategoriesService) {}

  ngOnChanges(): void {

    this.categoriesSrv.getCategoriesData().subscribe(data => {
      //console.log(data);
    
      // Crear el objeto de colores a partir de los datos recibidos
      const categoryColors: { [key: string]: string } = data.reduce((acc:any, category:any) => {
        acc[category.name] = category.color;
        return acc;
      }, {} as { [key: string]: string });

      //console.log(categoryColors);

      // Crear un array de colores para las categorías de series
      const colors = this.series.map((seriesItem: any) => {
        return categoryColors[seriesItem.name] || '#000000';  // Color por defecto
      });


    this.chartOptions = {
      series: this.series,
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
      colors: colors,
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: 'category',
        categories: this.dates,
        labels: {
          style: {
              colors: '#ffffff',
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-xaxis-label',
          },
        },
      },
      yaxis:{
        labels: {
          style: {
              colors: '#ffffff',
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-xaxis-label',
          },
        },
      },
      legend: {
        show: true,
        position: 'bottom',
        labels: {
          colors: '#ffffff',
          useSeriesColors: false
        },
      },
      fill: {
        opacity: 1
      }
    };
  });
  }

}
