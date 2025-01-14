import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DataUserService } from '../../../core/services/user/data-user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionsService } from '../../../core/services/transactions/api/transactions.service';
import { NotificationsService } from '../../../core/services/notifications/api/notifications.service';
import { ModalUserSettingsService } from '../../../core/services/settings/modals/modal-user-settings.service';

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
    private settingSrv: ModalUserSettingsService,
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
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
      },
    });
    ////console.log(this.selectedFilter)
  }

  ngOnInit(): void {
    setInterval(() => {
      this.checkNotifications();
    }, 30000);
    this.getUserData();
  }

  getUserData(): void {
    this.dataUserService.getUserData().subscribe({
      next: (data) => {
        if (data.image && !data.image.startsWith('blob:')) {
          const blob = this.base64ToBlob(data.image, 'image/jpeg');
          data.image = URL.createObjectURL(blob);
        }
        this.user = data; // Solo un usuario
        //console.log('User data with image converted:', this.user);
      },
      error: (error) => console.error('Error fetching user data:', error),
    });
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteArray], { type: mimeType });
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
        // //console.log('¿Hay notificaciones sin leer?', this.notification);
        // //console.log(data);
      },
    });
  }

  openSettings() {
    this.settingSrv.openModal();
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
