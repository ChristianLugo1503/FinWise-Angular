import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomCurrencyPipe } from '../../shared/pipes/currency/custom-currency.pipe';
import { AlertRESService } from '../../core/services/alerts/alert-res.service';
import { ModalAlertService } from '../../core/services/alerts/modal-alert.service';
import { GroupsService } from '../../core/services/groups/api/groups.service';
import { ModalEditGroupService } from '../../core/services/groups/modals/modal-edit-group.service';
import { ModalOpenGroupService } from '../../core/services/groups/modals/modal-open-group.service';
import { GroupsMembersService } from '../../core/services/groups/api/groups-members.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-groups',
  imports: [CommonModule, CustomCurrencyPipe, FormsModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export default class GroupsComponent {
  mygroups: any[] = [];
  groups: any[] = [];
  searchText: string = '';

  constructor(
    private groupsSrv: GroupsService,
    private alertRES: AlertRESService,
    private alert: ModalAlertService,
    // private addGroupModal: ModalAddGroupService,
    private editGroupModal: ModalEditGroupService,
    private openGroupModal: ModalOpenGroupService,
    private groupsMembersSrv: GroupsMembersService
  ) {
    this.groupsSrv.getMYGroupsByUserId().subscribe({
      next: (data) => console.log(data),
      error: (error) => {
        console.error('Error al cargar los grupos:', error);
      },
    });
    this.groupsMembersSrv.getMembersByGroupId().subscribe({
      next: (data) => console.log(data),
      error: (error) => {
        console.error('Error al cargar los grupos:', error);
      },
    });
    this.getMYGroupsByUserId();
    this.getGroupsByUserId();
  }

  get filteredMYGroups(): any[] {
    const lowerSearchText = this.searchText.toLowerCase();
    return this.mygroups.filter(
      (group) =>
        group.name.toLowerCase().includes(lowerSearchText) ||
        group.description.toLowerCase().includes(lowerSearchText)
    );
  }

  get filteredGroups(): any[] {
    const lowerSearchText = this.searchText.toLowerCase();
    return this.groups.filter(
      (group) =>
        group.name.toLowerCase().includes(lowerSearchText) ||
        group.description.toLowerCase().includes(lowerSearchText)
    );
  }

  getMYGroupsByUserId(): void {
    this.groupsSrv.getMYGroupsData().subscribe({
      next: (data) => {
        if (data !== null) {
          this.mygroups = data;
          console.log('MY Groups', this.groups);
        }
      },
      error: (error) => {
        console.error('Error al cargar los grupos:', error);
      },
    });
  }

  getGroupsByUserId(): void {
    this.groupsMembersSrv
      .getMembersData()
      .pipe(
        // Usamos map para transformar los datos recibidos
        map((members) => {
          if (members !== null) {
            // Extraemos solo los objetos del grupo (groupId) eliminando duplicados si es necesario
            return members.map((member: any) => member.groupId);
          }
          return [];
        })
      )
      .subscribe({
        next: (groups) => {
          this.groups = groups;
          console.log('Groups', this.groups); // Aquí tendrás solo los datos de los grupos
        },
        error: (error) => {
          console.error('Error al cargar los grupos:', error);
        },
      });
  }

  nomalizarFecha(date: any) {
    return new Date(date).toISOString().split('T')[0];
  }

  addGroup(): void {
    // this.addGroupModal.openModal();
  }

  deleteGroup(id: number): void {
    this.alertRES
      .openCustomDialog(
        'Advertencia',
        '¿Está seguro que desea eliminar el grupo?'
      )
      .subscribe((result: boolean) => {
        if (result) {
          this.groupsSrv.deleteGroup(id).subscribe({
            next: () => {
              this.alert.openCustomDialog(
                'Éxito',
                'Grupo eliminado correctamente',
                'success'
              );
            },
            error: (error) => {
              console.error('Error al eliminar el grupo:', error);
              this.alert.openCustomDialog(
                'Error',
                'Error al eliminar el grupo',
                'error'
              );
            },
          });
        }
      });
  }

  changeStatus(id: number, actualStatus: boolean): void {
    // console.log('Cambiar estado', id, !actualStatus);
    // this.groupsSrv.editGroupStatus(id, !actualStatus).subscribe({
    //   next: () => {
    //     console.log('Estado actualizado correctamente:');
    //     this.alert.openCustomDialog(
    //       'Éxito',
    //       'Estado del grupo actualizado correctamente',
    //       'success'
    //     );
    //   },
    //   error: (error) => {
    //     console.error('Error al actualizar el estado del grupo:', error);
    //     this.alert.openCustomDialog(
    //       'Error',
    //       'Error al actualizar el estado del grupo',
    //       'error'
    //     );
    //   },
    // });
  }

  openGroup(group: any) {
    this.openGroupModal.openModal(group);
    console.log('grupsosdfalsdhfklajshdfkljashd', group);
  }

  editGroup(group: any) {
    // this.editGroupModal.openModal(group);
  }
}
