import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataUserService {
  private BASE_URL = 'http://localhost:8080/api/v1/user';
  private userDataSubject: BehaviorSubject<any | null>;

  constructor(private httpClient: HttpClient) {
    // Intentamos cargar los datos del usuario desde localStorage al inicializar el servicio
    const storedData = localStorage.getItem('userData');
    this.userDataSubject = new BehaviorSubject<any | null>(storedData ? JSON.parse(storedData) : null);
  }
  
  // Cargar los datos del usuario desde la API y actualizar el BehaviorSubject y localStorage
  loadUserData(): Observable<any> {
    const userEmail = localStorage.getItem('Email');
    if (!userEmail) {
      console.error('No se encontró el email en localStorage.');
      throw new Error('El email no está definido en localStorage.');
    }

    return this.httpClient.get<any>(`${this.BASE_URL}/${userEmail}`).pipe(
      tap((data) => {
        // Actualizar el BehaviorSubject con los nuevos datos
        this.userDataSubject.next(data);
        
        // Guardar los datos en localStorage para persistencia
        localStorage.setItem('userData', JSON.stringify(data));
        console.log('Data loaded and stored:', data);
      })
    );
  }

  // Obtener los datos actuales del usuario de forma reactiva
  getUserData(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  // Obtener los datos del usuario de forma instantánea (sin Observable)
  getUserDataSnapshot(): any | null {
    return this.userDataSubject.value;
  }

  // Limpiar los datos del usuario (por ejemplo, al cerrar sesión) y eliminar de localStorage
  clearUserData(): void {
    this.userDataSubject.next(null);
    localStorage.removeItem('userData');
  }
}
