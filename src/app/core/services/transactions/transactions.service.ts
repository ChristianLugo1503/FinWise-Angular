import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private BASE_URL = 'http://localhost:8080/api/v1/transactions';
  private userDataSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);

  constructor(private httpClient: HttpClient) {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.userDataSubject.next(JSON.parse(userData));
    }
  }

  getTransactionsByUserId(): Observable<any> {
    const userData = this.userDataSubject.value;
    if (userData) {
      return this.httpClient.get<any>(`${this.BASE_URL}/user/${userData.id}`).pipe(
        tap((data) => {
          this.userDataSubject.next(data); // Emite los datos de las transacciones a los suscriptores
        })
      );
    } else {
      throw new Error('Transactions data not found');
    }
  }

  getTransactionsData(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  createTransaction(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.BASE_URL}/create`, data);
  }
}
