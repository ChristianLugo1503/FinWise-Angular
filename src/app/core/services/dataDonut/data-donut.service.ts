import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataDonutService {
  private dataDonut = new BehaviorSubject<any>(null);
  data$ = this.dataDonut.asObservable();

  setData(data: any) {
    this.dataDonut.next(data);
  }
}
