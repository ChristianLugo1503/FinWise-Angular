import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { DataUserService } from '../../user/data-user.service';

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  private BASE_URL = 'http://localhost:8080/api/v1/savings';
  private SavingsSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);

  constructor(
    private httpClient: HttpClient,
    private dataUserSrv: DataUserService
  ) {}

  // Cargar los ahorros por usuario
  getSavingsByUserId(): Observable<any> {
    return this.dataUserSrv.getUserData().pipe(
      switchMap((userData) => {
        if (userData && userData.id) {
          return this.httpClient
            .get<any>(`${this.BASE_URL}/user/${userData.id}`)
            .pipe(
              tap((data) => {
                this.SavingsSubject.next(data); // Actualizamos el BehaviorSubject con los datos
              }),
              catchError((error) => {
                console.error('Error al cargar los ahorros:', error);
                this.SavingsSubject.next(null); // En caso de error, reseteamos el BehaviorSubject
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
  getSavingsData(): Observable<any | null> {
    return this.SavingsSubject.asObservable();
  }

  createSaving(data: any) {
    return this.httpClient.post<any>(`${this.BASE_URL}/create`, data).pipe(
      tap(() => {
        // Refresca los ahorros después de crear una nueva
        this.getSavingsByUserId().subscribe();
      })
    );
  }

  editSavings(id: number, data: any) {
    return this.httpClient.put<any>(`${this.BASE_URL}/update/${id}`, data).pipe(
      tap(() => {
        // Refresca los ahorros después de crear una nueva
        this.getSavingsByUserId().subscribe();
      })
    );
  }

  abonar(id: number, amount: number) {
    return this.httpClient
      .put<any>(`${this.BASE_URL}/saved/${id}`, amount)
      .pipe(
        tap((response) => {
          //console.log('Respuesta exitosa:', response);
          // Refresca las transacciones después de editar una
          this.getSavingsByUserId().subscribe();
        })
      );
  }

  editSavingStatus(id: number, status: boolean) {
    //console.log(id, status);
    return this.httpClient
      .put<any>(`${this.BASE_URL}/status/${id}`, status)
      .pipe(
        tap((response) => {
          console.log('Respuesta exitosa:', response);
          // Refresca las transacciones después de editar una
          this.getSavingsByUserId().subscribe();
        })
      );
  }

  deleteSaving(id: any) {
    return this.httpClient.delete<any>(`${this.BASE_URL}/delete/${id}`).pipe(
      tap(() => {
        // Refresca las transacciones después de eliminar una
        this.getSavingsByUserId().subscribe();
      })
    );
  }

  clearData(): void {
    this.SavingsSubject.next(null);
    localStorage.removeItem('userData');
  }
}
