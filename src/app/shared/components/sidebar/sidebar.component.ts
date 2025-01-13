import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DataUserService } from '../../../core/services/user/data-user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionsService } from '../../../core/services/transactions/api/transactions.service';
import { NotificationsService } from '../../../core/services/notifications/api/notifications.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule], // Sin dependencias externas
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'], // Corregido: styleUrls
})
export class SidebarComponent implements OnInit {
  selectedFilter: string = '';
  user: any;
  notification!: boolean;

  constructor(
    private authService: AuthService,
    private dataUserService: DataUserService,
    private notificationsSrv: NotificationsService,
    private router: Router
  ) {
    this.notificationsSrv.getNotificationsByUserId().subscribe({
      error: (err) => console.error(err),
    });

    this.selectedFilter = this.router.url.replace(/\//g, '');
    this.checkNotifications();
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

  ngOnInit(): void {
    setInterval(() => {
      this.checkNotifications();
    }, 30000);
  }

  checkNotifications() {
    this.notificationsSrv.getNotificationsByUserId().subscribe({
      error: (err) => console.error(err),
    });
    this.notificationsSrv.getNotificationsData().subscribe({
      next: (data) => {
        this.notification = data.some(
          (notification: any) => !notification.readStatus
        );
        console.log('¿Hay notificaciones sin leer?', this.notification);
        console.log(data);
      },
    });
  }

  selected(selected: string, ruta: string) {
    this.selectedFilter = selected;
    this.router.navigate([ruta]);
  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }

  logout(): void {
    this.authService.logout();
  }
}
