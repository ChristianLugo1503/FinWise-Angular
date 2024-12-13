import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, catchError, of, tap } from 'rxjs';
import { DataUserService } from '../dataUser/data-user.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private BASE_URL = 'http://localhost:8080/api/v1/transactions';
  private transactionsSubject: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);

  constructor(
    private httpClient: HttpClient,
    private dataUserSrv: DataUserService
  ) {}

  // Obtener las transacciones por usuario, solo si los datos del usuario están disponibles
  getTransactionsByUserId(): Observable<any[]> {
    return this.dataUserSrv.getUserData().pipe(
      switchMap((userData) => {
        if (userData && userData.id) {
          // Si los datos del usuario están listos, obtenemos las transacciones
          return this.httpClient.get<any[]>(`${this.BASE_URL}/user/${userData.id}`).pipe(
            tap((data) => {
              //console.log('Transacciones Cargadas', data);
              this.transactionsSubject.next(data); // Actualizamos el BehaviorSubject con los datos de transacciones
            }),
            catchError((error) => {
              console.error('Error al cargar transacciones:', error);
              return of([]); // Devuelve un array vacío en caso de error
            })
          );
        } else {
          // Si no se encuentran los datos del usuario, devolvemos un array vacío
          return of([]);
        }
      })
    );
  }

  // Obtener las transacciones observables
  getTransactionsData(): Observable<any[] | null> {
    return this.transactionsSubject.asObservable();
  }

  // Crear una nueva transacción
  createTransaction(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.BASE_URL}/create`, data).pipe(
      tap(() => {
        // Refresca las transacciones después de crear una nueva
        this.getTransactionsByUserId().subscribe();
      })
    );
  }

  deleteTransaction(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.BASE_URL}/delete/${id}`).pipe(
      tap(() => {
        this.getTransactionsByUserId().subscribe();
      }),
      catchError((error) => {
        console.error('Error al eliminar la transacción:', error);
        return of(); 
      })
    );
  }

  clearData(): void {
    this.transactionsSubject.next(null);
  }
}
