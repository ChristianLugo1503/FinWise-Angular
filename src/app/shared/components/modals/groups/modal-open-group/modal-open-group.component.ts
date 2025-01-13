import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { SavingsService } from '../../../../../core/services/savings/api/savings.service';
import { ModalAbonoSavingService } from '../../../../../core/services/savings/modals/modal-abono-saving.service';
import { ModalAddSavingComponent } from '../../savings/modal-add-saving/modal-add-saving.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomCurrencyPipe } from '../../../../pipes/currency/custom-currency.pipe';
import { GroupsService } from '../../../../../core/services/groups/api/groups.service';
import { DataUserService } from '../../../../../core/services/user/data-user.service';
import { SemiCircleChartComponent } from '../../../charts/semi-circle-chart/semi-circle-chart.component';
import { GroupsMembersService } from '../../../../../core/services/groups/api/groups-members.service';
import { ModalAddMemberGroupService } from '../../../../../core/services/groups/modals/modal-add-member-group.service';
import { AlertRESService } from '../../../../../core/services/alerts/alert-res.service';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { ModalNewContributionGroupService } from '../../../../../core/services/groups/modals/modal-new-contribution-group.service';
import { ModalViewContributionsService } from '../../../../../core/services/groups/modals/modal-view-contributions.service';
import { ModalViewUserContributionsService } from '../../../../../core/services/groups/modals/modal-view-user-contributions.service';
import { GroupsContributionsService } from '../../../../../core/services/groups/api/groups-contributions.service';

@Component({
  selector: 'app-modal-open-group',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomCurrencyPipe,
    SemiCircleChartComponent,
  ],
  templateUrl: './modal-open-group.component.html',
  styleUrl: './modal-open-group.component.css',
})
export class ModalOpenGroupComponent {
  percent: number = 0;
  color: string = '#ffc200';
  group: any;
  userId!: number;
  miembros: any;
  isMenuOpen: boolean = false;
  contribucionesGroup: any;

  constructor(
    public dialogRef: MatDialogRef<ModalAddSavingComponent>,
    private groupsSrv: GroupsService,
    private newContributionModal: ModalNewContributionGroupService,
    private userSrv: DataUserService,
    private membersGroup: GroupsMembersService,
    private addMemberModal: ModalAddMemberGroupService,
    private alertRES: AlertRESService,
    private alert: ModalAlertService,
    private viewContributionsModal: ModalViewContributionsService,
    private modalviewUserContribution: ModalViewUserContributionsService,
    private contributionSrv: GroupsContributionsService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public groupId: any
  ) {
    this.userSrv.loadUserData().subscribe({
      next: (data) => (this.userId = data.id),
      error: (err) => console.error(err),
    });
    this.getGroupById();
    this.membersGroup.getListMembersByGroupId(this.groupId.id).subscribe({
      // next: (data) => console.log('Miembros que pertenecen al grupo', data),
      error: (error) => console.error(error),
    });
    this.membersGroup.getAllGroupMembers().subscribe({
      // next: (data) => console.log('Miembros que pertenecen al grupo', data),
      error: (error) => console.error(error),
    });
    console.log('group id', this.groupId);
  }

  getGroupById() {
    this.groupsSrv.getGroupById(this.groupId.id).subscribe({
      // next: (data) => console.log('data obtenida', data, 'data2', groupId.id),
      error: (error) => console.error(error),
    });
  }

  calculatePercent(total: number, cantidad: number): number {
    return Math.round(((cantidad * 100) / total) * 100) / 100;
  }

  ngOnInit(): void {
    this.getGroupdataPercent();
    this.getMembers();
    this.getContributionsByGroupId();
  }

  getGroupdataPercent() {
    this.groupsSrv.getGroupData().subscribe({
      next: (data) => {
        this.group = data;
        this.percent = this.calculatePercent(data.goalAmount, data.savedAmount);
        //console.log('GRUPPOOOO', this.group);
      },
      error: (error) => console.error(error),
    });
  }

  getContributionsByGroupId(): void {
    this.contributionSrv.getContributionsByGroupId(this.groupId.id).subscribe({
      next: (data) => {
        if (data) {
          this.contribucionesGroup = data;
        }
      },
      error: (error) =>
        console.error('Error al cargar las contribuciones:', error),
    });
  }

  getTotalContribuido(memberId: number): number {
    const memberContributions = this.contribucionesGroup.filter(
      (contribution: any) => contribution.user.id === memberId
    );
    const total = memberContributions.reduce(
      (sum: number, contribution: any) => sum + contribution.amount,
      0
    );
    return total;
  }

  getMembers() {
    this.membersGroup.getMembersListData().subscribe({
      next: (data) => {
        if (data !== null) {
          this.miembros = data;
          console.log('miembros desde get members', data);
        }
      },
      error: (error) => console.error(error),
    });
  }

  openContribuir(group: any) {
    this.newContributionModal.openModal(group);

    this.getGroupById(); // Recarga los datos del grupo
    this.getGroupdataPercent(); // Recalcula el porcentaje
    this.getContributionsByGroupId(); // Recarga las contribuciones
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  onHistory(group: any, memberId: number) {
    this.modalviewUserContribution.openModal(group, memberId);
  }

  openContributions(group: any) {
    this.viewContributionsModal.openModal(group);
  }

  addMember(group: number) {
    this.addMemberModal.openModal(group);
    this.getMembers();
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  expulsarIntegrante(memberId: number) {
    this.alertRES
      .openCustomDialog(
        'Advertencia',
        '¿Está seguro que desea eliminar al integrante del grupo?'
      )
      .subscribe((result: boolean) => {
        if (result) {
          this.membersGroup.getAllGroupMembersData().subscribe({
            next: (data) => {
              if (data !== null) {
                const filtered = data.filter(
                  (member: any) =>
                    member.groupId.id === this.groupId.id &&
                    member.userId.id === memberId
                );
                this.deleteGroupMember(filtered[0].id);
                // Después de eliminar el miembro, forzamos la detección de cambios
                this.getMembers();
                this.cdr.detectChanges(); // Forzar la detección de cambios
              }
            },
            error: (err) => console.error(err),
          });
        }
      });
    this.isMenuOpen = false;
  }

  deleteGroupMember(id: number) {
    this.membersGroup.deleteMember(id).subscribe({
      next: () => {
        this.alert.openCustomDialog(
          'Éxito',
          'Integrante eliminado correctamente',
          'success'
        );
        this.getMembers();
        this.cdr.detectChanges(); // Forzar la detección de cambios
      },
      error: (error) => {
        console.error('Error al eliminar al integrante', error);
        this.alert.openCustomDialog(
          'Error',
          'Error al eliminar al Integrante',
          'error'
        );
      },
    });
  }
}
