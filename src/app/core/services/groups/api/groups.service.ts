import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { DataUserService } from '../../user/data-user.service';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private BASE_URL_MY_GROUPS = 'http://localhost:8080/api/v1/groups';
  private MYGroupsSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);

  private GroupSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);

  constructor(
    private httpClient: HttpClient,
    private dataUserSrv: DataUserService
  ) {}

  // Cargar mis grupos
  getMYGroupsByUserId(): Observable<any> {
    return this.dataUserSrv.getUserData().pipe(
      switchMap((userData) => {
        if (userData && userData.id) {
          return this.httpClient
            .get<any>(`${this.BASE_URL_MY_GROUPS}/user/${userData.id}`)
            .pipe(
              tap((data) => {
                this.MYGroupsSubject.next(data); // Actualizamos el BehaviorSubject con los datos
              }),
              catchError((error) => {
                console.error('Error al cargar los grupos:', error);
                this.MYGroupsSubject.next(null); // En caso de error, reseteamos el BehaviorSubject
                return of(null);
              })
            );
        } else {
          return of(null);
        }
      })
    );
  }

  // Cargar grupo por id
  getGroupById(id: number): Observable<any> {
    return this.dataUserSrv.getUserData().pipe(
      switchMap((userData) => {
        if (userData && userData.id) {
          return this.httpClient
            .get<any>(`${this.BASE_URL_MY_GROUPS}/${id}`)
            .pipe(
              tap((data) => {
                this.GroupSubject.next(data); // Actualizamos el BehaviorSubject con los datos
              }),
              catchError((error) => {
                console.error('Error al cargar el grupo', error);
                this.GroupSubject.next(null); // En caso de error, reseteamos el BehaviorSubject
                return of(null);
              })
            );
        } else {
          return of(null);
        }
      })
    );
  }

  // Obtener los grupos observables
  getGroupData(): Observable<any | null> {
    return this.GroupSubject.asObservable();
  }

  // Obtener los grupos observables
  getMYGroupsData(): Observable<any | null> {
    return this.MYGroupsSubject.asObservable();
  }

  createGroup(data: any) {
    return this.httpClient
      .post<any>(`${this.BASE_URL_MY_GROUPS}/create`, data)
      .pipe(
        tap(() => {
          // Refresca los grupos después de crear uno nuevo
          this.getMYGroupsByUserId().subscribe();
        })
      );
  }

  editGroup(id: number, data: any) {
    return this.httpClient
      .put<any>(`${this.BASE_URL_MY_GROUPS}/update/${id}`, data)
      .pipe(
        tap(() => {
          // Refresca los grupos después de editar uno
          this.getMYGroupsByUserId().subscribe();
        })
      );
  }

  deleteGroup(id: any) {
    return this.httpClient
      .delete<any>(`${this.BASE_URL_MY_GROUPS}/delete/${id}`)
      .pipe(
        tap(() => {
          // Refresca los grupos después de eliminar uno
          this.getMYGroupsByUserId().subscribe();
        })
      );
  }

  clearData(): void {
    this.MYGroupsSubject.next(null);
    localStorage.removeItem('userData');
  }
}
