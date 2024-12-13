import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DataUserService } from '../../../core/services/dataUser/data-user.service';
import { TransactionsService } from '../../../core/services/transactions/transactions.service';
import { FormsModule, NgModel } from '@angular/forms';
import { NgClass, NgStyle } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [FormsModule, NgClass], // Sin dependencias externas
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'] // Corregido: styleUrls
})
export class SidebarComponent {
  selectedFilter: string = 'inicio';
  user: any;

  constructor(
    private authService: AuthService,
    private dataUserService: DataUserService,
    private transactionsSrv: TransactionsService,
    private router: Router
  ) {
    dataUserService.loadUserData().subscribe({
      next: (response) => {
        //console.log('Datos del usuario cargados:', response);
        this.user = response;
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
      },
    });
    //console.log(this.selectedFilter)
  }
  
  selected(selected:string, ruta:string){
    this.selectedFilter = selected;
    this.router.navigate([ruta]);
    console.log(this.selectedFilter, ruta)
  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }

  logout(): void {
    this.authService.logout();
  }
}
