import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, catchError, of, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DataUserService } from '../dataUser/data-user.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private BASE_URL = 'http://localhost:8080/api/v1/categories';
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
          return this.httpClient.get<any>(`${this.BASE_URL}/user/${userData.id}`).pipe(
            tap((data) => {
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

  // Método para editar una categoría
  editCategory(categoryId: number, updatedCategory: any): Observable<any> {
    return this.httpClient.put<any>(`${this.BASE_URL}/update/${categoryId}`, updatedCategory).pipe(
      tap((updatedCategory) => {
        // Aquí puedes actualizar el BehaviorSubject si es necesario
        this.categoriesSubject.next(updatedCategory);
      }),
      catchError((error) => {
        console.error('Error al editar la categoría:', error);
        return of(null); // Devuelve un observable vacío en caso de error
      })
    );
  }

  // Método para eliminar una categoría
  deleteCategory(categoryId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.BASE_URL}/delete/${categoryId}`).pipe(
      tap((response) => {
        if (response.success) {
          this.categoriesSubject.next(this.categoriesSubject.getValue()?.filter((category: any) => category.id !== categoryId));
        } 
      }),
      catchError((error) => {
        console.error(error.error.message);
        //this.alert.openCustomDialog('Error', 'Ocurrió un problema al eliminar la categoría', 'error');
        return throwError(() => new Error(error.error.message));
      })
    );
  }
  
  // Añadimos el nuevo método 'createCategory' al servicio
  createCategory(name: string, type: string, userId: number, image: File, color: string): Observable<any> {
    // Creamos un FormData para enviar los datos como multipart/form-data (necesario para archivos como imagen)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('userId', userId.toString()); // Convertimos el ID a string
    formData.append('image', image); // Añadimos el archivo de imagen
    formData.append('color', color);

    return this.httpClient.post<any>(`${this.BASE_URL}/create`, formData).pipe(
      tap((data) => {
        // Aquí puedes manejar la respuesta si es necesario
        console.log('Categoría creada:', data);
      }),
      catchError((error) => {
        console.error('Error al crear la categoría:', error);
        return throwError(() => new Error(error.error.message || 'Error al crear la categoría'));
      })
    );
  }



}
