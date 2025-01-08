import { Component, EventEmitter, Output } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
@Component({
  selector: 'app-time-picker',
  imports: [NgxMaterialTimepickerModule],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.css',
})
export class TimePickerComponent {
  @Output() selectedTimeChange = new EventEmitter<string>();

  onTimeSet(time: string): void {
    const timeIn24HourFormat = this.convertTo24HourFormat(time);
    this.selectedTimeChange.emit(timeIn24HourFormat);
  }

  // Conversión de formato 12 horas (hh:mm AM/PM) a formato 24 horas (HH:mm)
  private convertTo24HourFormat(time: string): string {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }
}
