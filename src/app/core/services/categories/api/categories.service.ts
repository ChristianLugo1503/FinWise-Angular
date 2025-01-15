import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  catchError,
  of,
  tap,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DataUserService } from '../../user/data-user.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  //private BASE_URL = 'http://localhost:8080/api/v1/categories';
  private BASE_URL = `${environment.base_url}/categories`;
  private categoriesSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);

  constructor(
    private httpClient: HttpClient,
    private dataUserSrv: DataUserService
  ) {}

  // Cargar las categorías por usuario
  getCategoriesByUserId(): Observable<any> {
    return this.dataUserSrv.getUserData().pipe(
      switchMap((userData) => {
        if (userData && userData.id) {
          return this.httpClient
            .get<any>(`${this.BASE_URL}/user/${userData.id}`)
            .pipe(
              tap((data) => {
                this.categoriesSubject.next(data); // Actualizamos el BehaviorSubject con los datos de categorías
              }),
              catchError((error) => {
                console.error('Error al cargar categorías:', error);
                this.categoriesSubject.next(null); // En caso de error, reseteamos el BehaviorSubject
                return of(null);
              })
            );
        } else {
          return of(null);
        }
      })
    );
  }

  // Obtener las categorías observables
  getCategoriesData(): Observable<any | null> {
    return this.categoriesSubject.asObservable();
  }

  createCategory(
    name: string,
    type: string,
    userId: number,
    image: File,
    color: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('userId', userId.toString());
    formData.append('image', image);
    formData.append('color', color);

    return this.httpClient.post<any>(`${this.BASE_URL}/create`, formData).pipe(
      tap((data) => {
        this.getCategoriesByUserId().subscribe(); //Actualizamos los datos una vez creada la categoría
      }),
      catchError((error) => {
        console.error('Error al crear la categoría:', error);
        return throwError(
          () => new Error(error.error.message || 'Error al crear la categoría')
        );
      })
    );
  }

  editCategory(
    categoryId: number,
    name: string,
    type: string,
    image: File,
    color: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('image', image);
    formData.append('color', color);

    return this.httpClient
      .put<any>(`${this.BASE_URL}/update/${categoryId}`, formData)
      .pipe(
        tap((data) => {
          this.getCategoriesByUserId().subscribe(); //Actualizamos los datos una vez editada la categoría
        }),
        catchError((error) => {
          console.error('Error al editar la categoría:', error);
          return of(null); // Devuelve un observable vacío en caso de error
        })
      );
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.BASE_URL}/delete/${categoryId}`)
      .pipe(
        tap((response) => {
          if (response.success) {
            //this.categoriesSubject.next(this.categoriesSubject.getValue()?.filter((category: any) => category.id !== categoryId));
            this.getCategoriesByUserId().subscribe(); //Actualizamos los datos una vez eliminada la categoría
          }
        }),
        catchError((error) => {
          console.error(error.error.message);
          //this.alert.openCustomDialog('Error', 'Ocurrió un problema al eliminar la categoría', 'error');
          return throwError(() => new Error(error.error.message));
        })
      );
  }

  clearData(): void {
    this.categoriesSubject.next(null);
    localStorage.removeItem('userData');
  }
}
