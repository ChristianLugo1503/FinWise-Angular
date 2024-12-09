import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DataUserService } from '../../../core/services/dataUser/data-user.service';
import { TransactionsService } from '../../../core/services/transactions/transactions.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [], // Sin dependencias externas
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'] // Corregido: styleUrls
})
export class SidebarComponent {
  user: any;

  constructor(
    private authService: AuthService,
    private dataUserService: DataUserService,
    private transactionsSrv: TransactionsService,
  ) {
    this.dataUserService.loadUserData().subscribe({
      next: (response) => {
        //console.log('Datos del usuario cargados:', response);
        this.user = response;
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
