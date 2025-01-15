import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { DataUserService } from '../../user/data-user.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecurringPaymentsService {
  //private BASE_URL = 'http://localhost:8080/api/v1/recurringPayments';
  private BASE_URL = `${environment.base_url}/recurringPayments`;

  private paymentsSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);

  constructor(
    private httpClient: HttpClient,
    private dataUserSrv: DataUserService
  ) {}

  // Cargar las Pagos recurrentes por usuario
  getPaymentsByUserId(): Observable<any> {
    return this.dataUserSrv.getUserData().pipe(
      switchMap((userData) => {
        if (userData && userData.id) {
          return this.httpClient
            .get<any>(`${this.BASE_URL}/user/${userData.id}`)
            .pipe(
              tap((data) => {
                this.paymentsSubject.next(data); // Actualizamos el BehaviorSubject con los datos
              }),
              catchError((error) => {
                console.error('Error al cargar categorías:', error);
                this.paymentsSubject.next(null); // En caso de error, reseteamos el BehaviorSubject
                return of(null);
              })
            );
        } else {
          return of(null);
        }
      })
    );
  }

  // Obtener las categorías observables
  getRecurringPaymentData(): Observable<any | null> {
    return this.paymentsSubject.asObservable();
  }

  createRecurrentPayment(data: any) {
    return this.httpClient.post<any>(`${this.BASE_URL}/create`, data).pipe(
      tap(() => {
        // Refresca las transacciones después de crear una nueva
        this.getPaymentsByUserId().subscribe();
      })
    );
  }

  editRecurrentPayment(id: number, data: any) {
    return this.httpClient.put<any>(`${this.BASE_URL}/update/${id}`, data).pipe(
      tap(() => {
        // Refresca las transacciones después de crear una nueva
        this.getPaymentsByUserId().subscribe();
      })
    );
  }

  editRecurringPaymentStatus(id: number, status: boolean) {
    //console.log(id, status);
    return this.httpClient
      .put<any>(`${this.BASE_URL}/status/${id}`, status)
      .pipe(
        tap((response) => {
          //console.log('Respuesta exitosa:', response);
          // Refresca las transacciones después de editar una
          this.getPaymentsByUserId().subscribe();
        })
      );
  }

  deleteRecurringPayment(id: any) {
    return this.httpClient.delete<any>(`${this.BASE_URL}/delete/${id}`).pipe(
      tap(() => {
        // Refresca las transacciones después de eliminar una
        this.getPaymentsByUserId().subscribe();
      })
    );
  }

  clearData(): void {
    this.paymentsSubject.next(null);
    localStorage.removeItem('userData');
  }
}
