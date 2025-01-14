import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalAlertService } from '../../../../../core/services/alerts/modal-alert.service';
import { DataUserService } from '../../../../../core/services/user/data-user.service';
import { AuthService } from '../../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-modal-user-settings',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './modal-user-settings.component.html',
  styleUrl: './modal-user-settings.component.css',
})
export class ModalUserSettingsComponent implements OnInit {
  userData: any;
  image: any;
  userForm: FormGroup;
  userImage: any;

  constructor(
    private modalAlertSrv: ModalAlertService,
    public dataUserService: DataUserService,
    public dialogRef: MatDialogRef<ModalUserSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private router: Router
  ) {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      password: new FormControl('', [
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/),
      ]),
      newPassword: new FormControl(''),
      image: new FormControl(''),
    });

    this.getUserData();
  }

  ngOnInit(): void {
    if (this.userData) {
      console.log('user data', this.userData);
      this.userForm.patchValue({
        name: this.userData.name,
        lastname: this.userData.lastname,
        email: this.userData.email,
      });

      const previewElement = document.getElementById(
        'image-preview'
      ) as HTMLElement;
      if (previewElement && this.userData.image) {
        previewElement.style.backgroundImage = `url('${this.userData.image}')`;
        previewElement.style.backgroundSize = 'cover';
        previewElement.style.backgroundPosition = 'center';
      }
    }
  }

  getUserData(): void {
    this.dataUserService.getUserData().subscribe({
      next: (data) => {
        if (data.image && !data.image.startsWith('blob:')) {
          const blob = this.base64ToBlob(data.image, 'image/jpeg');
          data.image = URL.createObjectURL(blob);
        }
        this.userData = data; // Solo un usuario
        console.log('User data with image converted:', this.userData);
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

  sendForm(): void {
    if (this.userForm.valid) {
      const formData = new FormData();
      formData.append('name', this.userForm.get('name')?.value || '');
      formData.append('lastname', this.userForm.get('lastname')?.value || '');
      formData.append('email', this.userForm.get('email')?.value || '');
      formData.append('password', this.userForm.get('password')?.value || '');
      formData.append(
        'newPassword',
        this.userForm.get('newPassword')?.value || ''
      );
      if (this.image) {
        formData.append('image', this.image);
      }

      // Verificar si hubo un cambio en el correo o la contraseña
      const isEmailChanged =
        this.userData.email !== this.userForm.get('email')?.value;
      const isPasswordChanged = this.userForm.get('password')?.value !== '';

      this.dataUserService.editUser(this.userData.id, formData).subscribe({
        next: (data) => {
          this.modalAlertSrv.openCustomDialog(
            'Usuario actualizado',
            'El usuario ha sido actualizado correctamente.',
            'success'
          );

          // Si el correo o la contraseña cambió, cerrar la sesión
          if (isEmailChanged || isPasswordChanged) {
            setTimeout(() => {
              this.modalAlertSrv.closeDialog(); // Cierra el modal
              this.logout();
            }, 2000);
          } else {
            this.dialogRef.close();
          }
        },
        error: (error) => {
          this.modalAlertSrv.openCustomDialog(
            'Error',
            error.error.message,
            'error'
          );
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  logout(): void {
    this.authService.logout();
  }

  checkEmail(): string {
    const control = this.userForm.get('email');
    if (control?.hasError('required') && control.touched) {
      return 'Email is required!';
    } else if (control?.hasError('pattern')) {
      return 'Invalid email format (example@domain.com).';
    }
    return '';
  }

  checkPassword(): string {
    const control = this.userForm.get('password');
    if (control?.hasError('required') && control.touched) {
      return 'Contraseña requerida!';
    } else if (control?.hasError('pattern')) {
      return 'La contraseña debe tener al menos 6 caracteres, incluyendo una letra mayúscula, una letra minúscula y un número.';
    } else {
      return '';
    }
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB
      if (file.size > maxSizeInBytes) {
        this.modalAlertSrv.openCustomDialog(
          'Error',
          'La imagen es demasiado grande. El tamaño máximo permitido es 1MB.',
          'error'
        );
        return;
      }

      this.image = file;
      const reader = new FileReader();
      reader.onload = () => {
        const previewElement = document.getElementById(
          'image-preview'
        ) as HTMLElement;
        if (previewElement) {
          previewElement.style.backgroundImage = `url(${reader.result})`;
          previewElement.style.backgroundSize = 'cover';
          previewElement.style.backgroundPosition = 'center';
        }
      };
      reader.readAsDataURL(file);
      this.userForm.patchValue({ image: file });
    }
  }

  hasRequiredError(field: string): boolean {
    const control = this.userForm.get(field);
    return !!control?.hasError('required') && control.touched;
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
