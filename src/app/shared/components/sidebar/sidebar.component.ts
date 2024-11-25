import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { DataUserService } from '../../../core/services/data-user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  user: any;

  constructor(
    private authService: AuthService,
    private dataUserService: DataUserService
  ){
    this.dataUserService.loadUserData().subscribe({
      next: (response) => {
        console.log('Datos del usuario cargados:', response);
        this.user = response;
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
      },
    });
  }

  logout():void{
    this.authService.logout()
  }

}
