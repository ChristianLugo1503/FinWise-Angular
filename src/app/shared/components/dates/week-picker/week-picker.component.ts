import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injectable, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import {
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDateRangeSelectionStrategy,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Injectable()
export class SundayWeekRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  private _dateAdapter = inject<DateAdapter<D>>(DateAdapter<D>);

  selectionFinished(date: D | null): DateRange<D> {
    return this._createSundayWeekRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createSundayWeekRange(activeDate);
  }

  private _createSundayWeekRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -this._getDayOfWeek(date));
      const end = this._dateAdapter.addCalendarDays(start, 6);
      return new DateRange<D>(start, end);
    }
    return new DateRange<D>(null, null);
  }

  private _getDayOfWeek(date: D): number {
    return this._dateAdapter.getDayOfWeek(date);
  }
}

@Component({
  selector: 'app-week-picker',
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: SundayWeekRangeSelectionStrategy,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, // Calendario en español
    provideNativeDateAdapter(),
  ],
  imports: [MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './week-picker.component.html',
  styleUrls: ['./week-picker.component.css'],
})
export class WeekPickerComponent implements OnInit {
  @Output() dateRangeSelected = new EventEmitter<{ start: string, end: string }>(); // Evento que emite un objeto

  startDate: Date | null = null;
  endDate: Date | null = null;

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(this.startDate),
    end: new FormControl<Date | null>(this.endDate),
  });

  private _dateAdapter = inject<DateAdapter<Date>>(DateAdapter);

  ngOnInit() {
    const today = this._dateAdapter.today();
    this.startDate = this._dateAdapter.addCalendarDays(today, -this._getDayOfWeek(today));
    this.endDate = this._dateAdapter.addCalendarDays(this.startDate, 6);

    // Establecer las fechas iniciales en el formulario
    this.range.setValue({
      start: this.startDate,
      end: this.endDate,
    });

    // Emitir las fechas iniciales como objeto
    this.emitDateRange();
  }

  // Emitir el rango de fechas como un objeto con fechas formateadas
  emitDateRange() {
    if (this.range.value.start && this.range.value.end) {
      const startFormatted = this.formatDate(this.range.value.start);
      const endFormatted = this.formatDate(this.range.value.end);

      const dateRange = {
        start: startFormatted,
        end: endFormatted,
      };

      this.dateRangeSelected.emit(dateRange);
      //console.log(this.dateRangeSelected)
    }
  }

  // Método para formatear una fecha en 'YYYY-MM-DD'
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private _getDayOfWeek(date: Date): number {
    return this._dateAdapter.getDayOfWeek(date);
  }
}