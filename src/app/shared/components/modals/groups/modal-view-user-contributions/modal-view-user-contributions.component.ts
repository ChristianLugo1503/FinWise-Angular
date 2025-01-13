import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GroupsContributionsService } from '../../../../../core/services/groups/api/groups-contributions.service';
import { DataUserService } from '../../../../../core/services/user/data-user.service';

@Component({
  selector: 'app-modal-view-user-contributions',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-view-user-contributions.component.html',
  styleUrls: ['./modal-view-user-contributions.component.css'],
})
export class ModalViewUserContributionsComponent implements OnInit {
  contribuciones: any[] = [];
  currentDate: string = new Date().toISOString(); // Fecha actual en formato ISO
  groupId!: number; // ID del grupo recibido
  memberId!: number; // ID del miembro recibido

  constructor(
    public dialogRef: MatDialogRef<ModalViewUserContributionsComponent>,
    private contributionSrv: GroupsContributionsService,
    private userSrv: DataUserService,
    @Inject(MAT_DIALOG_DATA) public data: { group: any; memberId: number }
  ) {
    this.groupId = this.data.group.id;
    this.memberId = this.data.memberId;
  }

  ngOnInit(): void {
    this.getContributionsByGroupId();
  }

  // Obtener las contribuciones por grupo y filtrarlas por miembro
  getContributionsByGroupId(): void {
    this.contributionSrv.getContributionsByGroupId(this.groupId).subscribe({
      next: (data) => {
        if (data) {
          this.contribuciones = data.filter(
            (contribution: any) => contribution.user.id === this.memberId
          );
          console.log(
            'Contribuciones filtradas del miembro:',
            this.contribuciones
          );
        }
      },
      error: (error) =>
        console.error('Error al cargar las contribuciones:', error),
    });
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.dialogRef.close();
  }
}
