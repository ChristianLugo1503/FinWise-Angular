import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataUserService {
  private BASE_URL = 'http://localhost:8080/api/v1/user';
  private userDataSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);

  constructor(private httpClient: HttpClient) {}

  // Cargar los datos del usuario desde la API
  loadUserData(): Observable<any> {
    const userEmail = localStorage.getItem('Email');
    if (!userEmail) {
      throw new Error('El email no está definido en localStorage.');
    }
    return this.httpClient.get<any>(`${this.BASE_URL}/${userEmail}`).pipe(
      tap((data) => {
        this.userDataSubject.next(data); // Actualizamos el BehaviorSubject con los nuevos datos
      }),
      catchError((error) => {
        console.error('Error al cargar datos del usuario:', error);

        throw error;
      })
    );
  }

  getUserByEmail(email: string) {
    return this.httpClient.get<any>(`${this.BASE_URL}/${email}`).pipe(
      tap((data) => {}),
      catchError((error) => {
        console.error('Error al cargar datos del usuario:', error);
        throw error; // Rethrow error para que lo maneje quien llama al servicio
      })
    );
  }

  editUser(id: number, data: FormData) {
    return this.httpClient.put<any>(`${this.BASE_URL}/update/${id}`, data).pipe(
      tap(() => {
        // Obtener el email desde FormData
        const email = data.get('email') as string; // Usamos 'get' para obtener el valor de FormData

        // Verifica si el email ha cambiado
        const currentEmail = localStorage.getItem('Email');
        if (email && email !== currentEmail) {
          localStorage.setItem('Email', email);
        }

        // Recarga los datos del usuario
        this.loadUserData().subscribe();
      }),
      catchError((error) => {
        console.error('Error al editar usuario:', error);
        throw error;
      })
    );
  }

  // Obtener los datos del usuario de forma reactiva
  getUserData(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  // Limpiar los datos del usuario y eliminar de localStorage
  clearUserData(): void {
    this.userDataSubject.next(null);
    localStorage.removeItem('userData');
  }
}
