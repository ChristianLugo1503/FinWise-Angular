import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-range-picker',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    provideNativeDateAdapter()
  ],
  imports: [MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './range-picker.component.html',
  styleUrl: './range-picker.component.css'
})
export class RangePickerComponent {
  @Output() dateRangeSelected = new EventEmitter<{ start: string, end: string }>(); // Evento que emite un objeto

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

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
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
