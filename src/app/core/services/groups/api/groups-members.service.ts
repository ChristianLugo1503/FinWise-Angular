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
export class GroupsMembersService {
  private BASE_URL_MEMBERS = 'http://localhost:8080/api/v1/membersGroup';

  private membersSubject = new BehaviorSubject<any | null>(null);
  private listMembers = new BehaviorSubject<any | null>(null);
  private allGroupMembers = new BehaviorSubject<any | null>(null);

  constructor(
    private httpClient: HttpClient,
    private dataUserSrv: DataUserService
  ) {}

  // Cargar los miembros de un grupo por GroupId
  getMembersByGroupId(): Observable<any> {
    return this.dataUserSrv.getUserData().pipe(
      switchMap((userData) => {
        if (userData && userData.id) {
          return this.httpClient
            .get<any>(`${this.BASE_URL_MEMBERS}/user/${userData.id}`)
            .pipe(
              tap((data) => {
                this.membersSubject.next(data); // Actualizamos el BehaviorSubject para propagar los datos
              }),
              catchError((error) => {
                console.error('Error al cargar los grupos:', error);
                this.membersSubject.next(null); // En caso de error, reseteamos el BehaviorSubject
                return of(null);
              })
            );
        } else {
          return of(null);
        }
      })
    );
  }

  getListMembersByGroupId(groupId: number) {
    return this.httpClient
      .get<any>(`${this.BASE_URL_MEMBERS}/group/${groupId}`)
      .pipe(
        tap((data) => {
          this.listMembers.next(data); // Actualizamos el BehaviorSubject para propagar los datos
        }),
        catchError((error) => {
          console.error('Error al cargar los grupos:', error);
          this.listMembers.next(null); // En caso de error, reseteamos el BehaviorSubject
          return of(null);
        })
      );
  }

  getAllGroupMembers(): Observable<any> {
    return this.httpClient.get<any>(`${this.BASE_URL_MEMBERS}`).pipe(
      tap((data) => {
        this.allGroupMembers.next(data); // Actualizamos el BehaviorSubject para propagar los datos
      }),
      catchError((error) => {
        console.error('Error al cargar los grupos:', error);
        this.allGroupMembers.next(null); // En caso de error, reseteamos el BehaviorSubject
        return of(null);
      })
    );
  }

  // Obtener todos los datos de la tabla
  getAllGroupMembersData(): Observable<any | null> {
    return this.allGroupMembers.asObservable();
  }

  // Obtener los datos de los miembros observables
  getMembersData(): Observable<any | null> {
    return this.membersSubject.asObservable();
  }

  // Obtener los datos de los miembros observables
  getMembersListData(): Observable<any | null> {
    return this.listMembers.asObservable();
  }

  // Agregar un miembro a un grupo
  addMemberToGroup(groupId: number, userId: number): Observable<any> {
    const body = { groupId, userId }; // Objeto con el formato correcto

    return this.httpClient
      .post<any>(`${this.BASE_URL_MEMBERS}/create`, body)
      .pipe(
        tap(() => {
          this.getMembersByGroupId().subscribe(); // Actualizamos el BehaviorSubject para propagar los datos
          this.getListMembersByGroupId(groupId).subscribe(); // Actualizamos el BehaviorSubject para propagar los datos
        })
      );
  }

  // Editar un miembro de un grupo
  editMember(
    groupId: number,
    memberId: number,
    memberData: any
  ): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.BASE_URL_MEMBERS}/update/${groupId}/${memberId}`,
        memberData
      )
      .pipe(
        tap(() => {
          this.getMembersByGroupId().subscribe(); // Actualizamos el BehaviorSubject para propagar los datos
          this.getListMembersByGroupId(groupId).subscribe(); // Actualizamos el BehaviorSubject para propagar los datos
        })
      );
  }

  // Eliminar un miembro de un grupo
  deleteMember(groupId: number): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.BASE_URL_MEMBERS}/delete/${groupId}`)
      .pipe(
        tap(() => {
          this.getMembersByGroupId().subscribe(); // Actualizamos el BehaviorSubject para propagar los datos
          this.getListMembersByGroupId(groupId).subscribe(); // Actualizamos el BehaviorSubject para propagar los datos
        })
      );
  }

  // Limpiar datos de los miembros
  clearMembersData(): void {
    this.membersSubject.next(null); // Reseteamos el BehaviorSubject
    this.listMembers.next(null); // Reseteamos el BehaviorSubject
    this.allGroupMembers.next(null); // Reseteamos el BehaviorSubject
  }
}
