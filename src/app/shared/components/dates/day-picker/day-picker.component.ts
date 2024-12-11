import { ChangeDetectionStrategy, Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-day-picker',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    provideNativeDateAdapter()
  ],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day-picker.component.html',
  styleUrls: ['./day-picker.component.css']
})
export class DayPickerComponent implements OnInit {
  @Output() daySelected = new EventEmitter<string>();
  date = new FormControl(moment().toDate()); // Inicializar con la fecha actual como Date

  ngOnInit(): void {
    // Emitir la fecha actual al cargar el componente
    this.emitCurrentDate();
  }

  // Método para emitir la fecha actual
  emitCurrentDate(): void {
    const today = moment().format('YYYY-MM-DD');
    this.daySelected.emit(today);
    //console.log('Fecha actual:', today);
  }

  // Método para emitir la fecha seleccionada
  setDay(date: Date | null): void {
    if (date) {
      const formattedDate = moment(date).format('YYYY-MM-DD'); // Convertir a Moment y formatear
      this.daySelected.emit(formattedDate);
      //console.log('Fecha seleccionada:', formattedDate);
    }
  }
}
