import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DataUserService } from '../dataUser/data-user.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private BASE_URL = 'http://localhost:8080/api/v1/categories/user';
  private categoriesSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); // Estado de carga

  constructor(
    private httpClient: HttpClient,
    private dataUserSrv: DataUserService
  ) {}

  // Cargar las categorías por usuario
  getCategoriesByUserId(): Observable<any> {
    this.isLoadingSubject.next(true); // Iniciamos el estado de carga

    return this.dataUserSrv.getUserData().pipe(
      switchMap((userData) => {
        if (userData && userData.id) {
          // Si los datos del usuario están disponibles, hacemos la petición para obtener las categorías
          return this.httpClient.get<any>(`${this.BASE_URL}/${userData.id}`).pipe(
            tap((data) => {
              //console.log('CATEGORÍAS CARGADAS', data);
              this.categoriesSubject.next(data); // Actualizamos el BehaviorSubject con los datos de categorías
            }),
            catchError((error) => {
              console.error('Error al cargar categorías:', error);
              this.categoriesSubject.next(null); // En caso de error, reseteamos el BehaviorSubject
              return of(null); // Devuelve un observable vacío en caso de error
            }),
            tap(() => {
              this.isLoadingSubject.next(false); // Terminamos la carga
            })
          );
        } else {
          // Si no se encuentran los datos del usuario, terminamos la carga y retornamos un array vacío
          this.isLoadingSubject.next(false);
          return of(null);
        }
      })
    );
  }

  // Obtener las categorías observables
  getCategoriesData(): Observable<any | null> {
    //console.log('Categorías del usuario cargadas por medio de UserData');
    return this.categoriesSubject.asObservable();
  }

  // Obtener el estado de carga (si se están cargando las categorías)
  isLoading(): Observable<boolean> {
    return this.isLoadingSubject.asObservable();
  }

  clearData(): void {
    this.categoriesSubject.next(null);
    localStorage.removeItem('userData');
  }
}
