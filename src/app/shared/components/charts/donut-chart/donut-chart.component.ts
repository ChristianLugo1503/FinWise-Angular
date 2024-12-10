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
import { CategoriesService } from '../../../../core/services/categories/categories.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  labels: any;
  legend: ApexLegend;
  colors:any;
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

  constructor(private categoriesSrv : CategoriesService){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] || changes['amounts']) {
      this.renderChart(); // Renderizar nuevamente la gráfica
    }
  }

  renderChart() {
    if (this.amounts.length === 0) {
      this.amounts = [0];
    }

    this.categoriesSrv.getUserData().subscribe(data => {
      console.log(data);
    
      // Crear el objeto de colores a partir de los datos recibidos
      const categoryColors = data.reduce((acc:any, category:any) => {
        acc[category.name] = category.color;
        return acc;
      }, {} as { [key: string]: string });
    
      console.log(categoryColors);
    
      // Puedes usar `categoryColors` para configurar los colores de la gráfica.
      const colors = this.categories.map(category => categoryColors[category] || '#000000');  // #000000 es color por defecto
    
      // Asignar los colores a la opción de la gráfica
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
                value: {
                  show: (this.amounts[0] !== 0),
                  color: '#ffffff'
                }
              }
            }
          }
        },
        labels: this.categories,
        colors: colors,  // Agrega los colores configurados
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
    });
    
  }
  
  
}
