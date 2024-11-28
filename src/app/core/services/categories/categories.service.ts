import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private BASE_URL = 'http://localhost:8080/api/v1/categories/user';
  private userDataSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);

  constructor(private httpClient: HttpClient) {
    // Cargar los datos del usuario desde localStorage y emitir el valor inicial
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.userDataSubject.next(JSON.parse(userData));
    }
  }

  // Cargar los datos del usuario desde la API y actualizar el BehaviorSubject
  getCategoriesByUserId(): Observable<any> {
    const userData = this.userDataSubject.value; // Obtén los datos actuales del BehaviorSubject
    if (userData) {
      return this.httpClient.get<any>(`${this.BASE_URL}/${userData.id}`).pipe(
        tap((data) => {
          this.userDataSubject.next(data); // Actualiza el BehaviorSubject con la respuesta
        })
      );
    } else {
      // Manejo de caso en el que `userData` no esté disponible (ejemplo, redirigir al login)
      throw new Error('User data not found');
    }
  }

  // Obtener los datos actuales del usuario de forma reactiva
  getUserData(): Observable<any> {
    console.log('Categorias del usuario Cargada por medio de USerDAta')
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
