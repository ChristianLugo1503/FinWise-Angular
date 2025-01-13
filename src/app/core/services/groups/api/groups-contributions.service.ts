import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  tap,
  catchError,
  of,
} from 'rxjs';
import { DataUserService } from '../../user/data-user.service';

@Injectable({
  providedIn: 'root',
})
export class GroupsContributionsService {
  private BASE_URL_CONTRIBUTIONS = 'http://localhost:8080/api/v1/contributions';
  private MYGroupsSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);

  constructor(
    private httpClient: HttpClient,
    private dataUserSrv: DataUserService
  ) {}

  // Cargar mis grupos
  // getMYGroupsByUserId(): Observable<any> {
  //   return this.dataUserSrv.getUserData().pipe(
  //     switchMap((userData) => {
  //       if (userData && userData.id) {
  //         return this.httpClient
  //           .get<any>(`${this.BASE_URL_MY_GROUPS}/user/${userData.id}`)
  //           .pipe(
  //             tap((data) => {
  //               this.MYGroupsSubject.next(data); // Actualizamos el BehaviorSubject con los datos
  //             }),
  //             catchError((error) => {
  //               console.error('Error al cargar los grupos:', error);
  //               this.MYGroupsSubject.next(null); // En caso de error, reseteamos el BehaviorSubject
  //               return of(null);
  //             })
  //           );
  //       } else {
  //         return of(null);
  //       }
  //     })
  //   );
  // }

  // Obtener los grupos observables
  // getMYGroupsData(): Observable<any | null> {
  //   return this.MYGroupsSubject.asObservable();
  // }

  createContribution(data: any) {
    return this.httpClient
      .post<any>(`${this.BASE_URL_CONTRIBUTIONS}/create`, data)
      .pipe(
        tap(() => {
          // Refresca los grupos después de crear uno nuevo
          //this.getMYGroupsByUserId().subscribe();
        })
      );
  }

  clearData(): void {
    this.MYGroupsSubject.next(null);
    localStorage.removeItem('userData');
  }
}
