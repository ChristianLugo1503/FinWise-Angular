import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataUserService {
  private BASE_URL = 'http://localhost:8080/api/v1/user';
  private userDataSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {
    // Intentamos cargar los datos del usuario desde localStorage solo si no están cargados en el BehaviorSubject
    const storedData = this.getUserDataFromLocalStorage();
    if (storedData) {
      this.userDataSubject.next(storedData);
    }
  }

  private getUserDataFromLocalStorage(): any | null {
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : null;
  }

  private saveUserDataToLocalStorage(data: any): void {
    localStorage.setItem('userData', JSON.stringify(data));
  }

  // Cargar los datos del usuario desde la API
  loadUserData(): Observable<any> {
    // Verificamos si ya están los datos cargados
    if (this.userDataSubject.value) {
      return of(this.userDataSubject.value); // Si ya está cargado, devolvemos los datos actuales
    }

    this.isLoadingSubject.next(true); // Indicamos que estamos cargando los datos

    const userEmail = localStorage.getItem('Email');
    if (!userEmail) {
      throw new Error('El email no está definido en localStorage.');
    }

    return this.httpClient.get<any>(`${this.BASE_URL}/${userEmail}`).pipe(
      tap((data) => {
        this.userDataSubject.next(data); // Actualizamos el BehaviorSubject con los nuevos datos
        this.saveUserDataToLocalStorage(data); // Guardamos los datos en localStorage
        this.isLoadingSubject.next(false); // Indicamos que la carga ha terminado
      }),
      catchError((error) => {
        console.error('Error al cargar datos del usuario:', error);
        this.isLoadingSubject.next(false); // En caso de error, indicamos que ha terminado
        throw error; // Rethrow error para que lo maneje quien llama al servicio
      })
    );
  }

  // Obtener los datos del usuario de forma reactiva
  getUserData(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  // Obtener el estado de carga
  isLoading(): Observable<boolean> {
    return this.isLoadingSubject.asObservable();
  }

  // Limpiar los datos del usuario y eliminar de localStorage
  clearUserData(): void {
    this.userDataSubject.next(null);
    localStorage.removeItem('userData');
  }
}
