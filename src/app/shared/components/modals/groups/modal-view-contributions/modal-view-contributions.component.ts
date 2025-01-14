import { CommonModule } from '@angular/common';
import { Component, inject, Inject, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { GroupsMembersService } from '../../../../../core/services/groups/api/groups-members.service';
import { DataUserService } from '../../../../../core/services/user/data-user.service';
import { ModalAbonoSavingComponent } from '../../savings/modal-abono-saving/modal-abono-saving.component';
import { GroupsContributionsService } from '../../../../../core/services/groups/api/groups-contributions.service';

@Component({
  selector: 'app-modal-view-contributions',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-view-contributions.component.html',
  styleUrl: './modal-view-contributions.component.css',
})
export class ModalViewContributionsComponent {
  userID: any;
  contribuciones: any;
  public currentDate!: string;

  constructor(
    public dialogRef: MatDialogRef<ModalAbonoSavingComponent>,
    private userSrv: DataUserService,
    private groupsMemberSrv: GroupsMembersService,
    private membersGroup: GroupsMembersService,
    private contributionSrv: GroupsContributionsService,
    @Inject(MAT_DIALOG_DATA) public group: any
  ) {
    this.userSrv.loadUserData().subscribe();
    this.userID = this.getUserId();
  }
  ngOnInit(): void {
    this.getContributionsByGroupId();
  }

  getContributionsByGroupId() {
    this.contributionSrv.getContributionsByGroupId(this.group.id).subscribe({
      next: (data) => {
        if (data !== null) {
          this.contribuciones = data;
          //console.log('Contribuciones del grupo', data);
        }
      },
      error: (error) => console.error(error),
    });
  }

  getUserId(): any {
    this.userSrv.getUserData().subscribe((data) => {
      if (data !== null) {
        this.userID = data.id;
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
