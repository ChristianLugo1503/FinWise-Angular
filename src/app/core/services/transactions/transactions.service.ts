import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private BASE_URL = 'http://localhost:8080/api/v1/transactions';

  constructor(
    private httpClient: HttpClient) 
  { }

  createTransaction(data:any): Observable<any>{
    return this.httpClient.post<any>(`${this.BASE_URL}/create`, data)
  }

}
