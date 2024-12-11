import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { CategoriesService } from '../categories/categories.service';
import { DataUserService } from '../dataUser/data-user.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:8080/api/v1/auth';
  
  private tokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';

  constructor(
    private httpClient: HttpClient, 
    private router: Router,
    private categoriesSrv: CategoriesService, 
    private dataUserSrv: DataUserService,
    private transactionSrv: TransactionsService
  ) { }

  login(data:any): Observable<any>{
    return this.httpClient.post<any>(`${this.BASE_URL}/login`, data).pipe(
      tap(response => {
        if(response.token){
          //console.log(response.token);
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken)
          this.autoRefreshToken();
        }
      })
    )
  }

  register(data: any): Observable<any>{
    return this.httpClient.post<any>(`${this.BASE_URL}/register`, data).pipe(
      tap(response => {
        if(response.token){
          //console.log(response.token);
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken)
          this.autoRefreshToken();
        }
      })
    )
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  } 

  public getToken(): string | null {
    if(typeof window !== 'undefined'){
      return localStorage.getItem(this.tokenKey);
    }else {
      return null;
    }
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  } 

  private getRefreshToken(): string | null {
    if(typeof window !== 'undefined'){
      return localStorage.getItem(this.refreshTokenKey);
    }else {
      return null;
    }
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.httpClient.post<any>(`${this.BASE_URL}/refresh`, { refreshToken: refreshToken }).pipe(
      tap(response => {
        if (response.token) {
          //console.log('Refresh token'+response.token);
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.autoRefreshToken();
        }
      })
    );
  }

  autoRefreshToken(): void {
    const token = this.getToken();
    if(!token){
      return;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;

    const timeout = exp - Date.now() - (60 * 1000);

    setTimeout(() => {
      this.refreshToken().subscribe()
    }, timeout);
   
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if(!token){
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem('Email')
    localStorage.removeItem('userData')
    this.categoriesSrv.clearData();
    this.dataUserSrv.clearUserData();
    this.transactionSrv.clearData();
    this.router.navigate(['/login']);
  }
}