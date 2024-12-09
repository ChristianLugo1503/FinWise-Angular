import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private BASE_URL = 'http://localhost:8080/api/v1/transactions';
  private userData: any | null = null; // Cambiado a una variable simple
  private transactionsSubject: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);

  constructor(private httpClient: HttpClient) {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.userData = JSON.parse(userData); // Guarda los datos del usuario directamente en la variable
    }
  }

  // Obtener las transacciones por usuario
  getTransactionsByUserId(): Observable<any[]> {
    if (this.userData) {
      return this.httpClient.get<any[]>(`${this.BASE_URL}/user/${this.userData.id}`).pipe(
        tap((data) => {
          this.transactionsSubject.next(data); // Actualiza las transacciones en el BehaviorSubject
        })
      );
    } else {
      throw new Error('User data not found');
    }
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
}
