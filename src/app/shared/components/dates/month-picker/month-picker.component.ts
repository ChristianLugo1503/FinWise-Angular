import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE } from '@angular/material/core';

const moment = _rollupMoment || _moment;

// Formato de fecha
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-month-picker',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    provideMomentDateAdapter(MY_FORMATS),
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './month-picker.component.html',
  styleUrl: './month-picker.component.css',
})
export class MonthPickerComponent implements OnInit {
  @Output() dateRangeSelected = new EventEmitter<{ start: string, end: string }>(); // Evento que emite un objeto

  ngOnInit(): void {
      // Generar y emitir el rango inicial
    const initialDate = this.date.value ?? moment();
    this.generateMonthRange(initialDate);
  }

  // Fecha seleccionada
  readonly date = new FormControl(moment()); 

  // Objeto para el rango del mes
  range: { start: string; end: string } | null = null;

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();

    // Generar rango del mes seleccionado
    this.generateMonthRange(ctrlValue);
  }

  private generateMonthRange(selectedDate: Moment) {
    const startOfMonth = selectedDate.clone().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = selectedDate.clone().endOf('month').format('YYYY-MM-DD');
    
    this.range = {
      start: startOfMonth,
      end: endOfMonth,
    };
    this.dateRangeSelected.emit(this.range);
    //console.log("RANGOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",this.range); 
  }
}
