import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE } from '@angular/material/core';

const moment = _rollupMoment || _moment;

// Formato de fecha para el año
export const YEAR_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-year-picker',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    provideMomentDateAdapter(YEAR_FORMATS),
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.css'],
})
export class YearPickerComponent implements OnInit {
  @Output() yearSelected = new EventEmitter<number>(); // Evento para emitir el año seleccionado

  // Fecha seleccionada (por defecto, el año actual)
  readonly date = new FormControl(moment());

  ngOnInit(): void {
    // Emitir el año inicial (año actual)
    const initialYear = this.date.value?.year() ?? moment().year();
    this.yearSelected.emit(initialYear);
  }

  setYear(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const selectedYear = normalizedYear.year();
    this.date.setValue(normalizedYear); // Actualiza el control con el nuevo año
    datepicker.close();

    // Emitir el año seleccionado
    this.yearSelected.emit(selectedYear);
    //console.log("Año seleccionado:", selectedYear);
  }
}
