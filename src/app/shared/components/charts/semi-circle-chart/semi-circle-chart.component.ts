import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
};

@Component({
  selector: 'app-semi-circle-chart',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './semi-circle-chart.component.html',
  styleUrls: ['./semi-circle-chart.component.css'],
})
export class SemiCircleChartComponent implements OnChanges {
  @Input() mensajeHijo: number = 0;
  @Input() color: string = '#ffffff';
  public chartOptions!: Partial<ChartOptions>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mensajeHijo'] || changes['color']) {
      this.updateChart();
    }
  }

  private updateChart() {
    this.chartOptions = {
      series: [this.mensajeHijo],
      chart: {
        type: 'radialBar',
        offsetY: -20,
        animations: {
          enabled: true,
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: '#ffffff',
            strokeWidth: '97%',
            margin: 5,
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              opacity: 0.31,
              blur: 2,
            },
          },
          dataLabels: {
            name: {
              show: true,
              offsetY: -30,
            },
            value: {
              color: '#ffffff',
              offsetY: -20,
              fontSize: '22px',
            },
          },
        },
      },
      fill: {
        colors: [this.color],
        type: 'solid',
      },
      labels: ['Progreso'],
    };
  }

  constructor() {
    this.updateChart(); // Asegúrate de inicializar el gráfico cuando el componente se cree
  }
}
