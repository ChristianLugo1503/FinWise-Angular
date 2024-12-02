import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DataUserService } from '../../../core/services/dataUser/data-user.service';
import { ModalAlertService } from '../../../core/services/alert/modal-alert.service';

@Component({
    selector: 'app-login',
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export default class LoginComponent {
  private modalAlertSrv = inject(ModalAlertService)

  form = signal<FormGroup>(
    new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      password: new FormControl('', [Validators.required])
    })
  );

  constructor(
    private authService: AuthService,
    private router: Router, 
    public dialog: MatDialog,
    public dataUserService: DataUserService
  ){}

  login(): void {
    this.authService.login(this.form().value).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        const token = response.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;
        localStorage.setItem('Email',payload.sub);

        this.dataUserService.loadUserData().subscribe({
          next: (response) => {
            console.log('Datos del usuario cargados:', response);
          },
          error: (error) => {
            console.error('Error al cargar datos del usuario:', error);
          },
        });

        if (role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        if (err.status === 401 && err.error?.error) {
          // Verificar el tipo de error basado en el campo "error"
          switch (err.error.error) {
            case 'Email not found':
              this.openCustomDialog('Error','La dirección de correo proporcionada no pertenece a ningún usuario.','error');
              break;
            case 'Incorrect password':
              this.openCustomDialog('Error','La contraseña ingresada es incorrecta. Por favor, verifica tus datos e inténtalo nuevamente.','error');
              break;
            default:
              this.openCustomDialog('Error','Por favor revise sus credenciales.','error');
          }
        } else {
          console.error('Unexpected error:', err);
          this.openCustomDialog('Error','Se ha producido un error inesperado. Inténtelo de nuevo más tarde.','error');
        }
      },
    });
  }

  checkEmail():string{
    const control = this.form().get('email');
    if (control?.hasError('required') && control.touched) {
      return 'Correo requerido!';
    }else if(control?.hasError('pattern')){
      return 'Correo inválido: (ejemplo@dominio.com).';
    }else{
      return '';
    }
  }

  hasRequiredError(fiel: string){
    const control = this.form().get(fiel);
    return control?.hasError('required') && control.touched
  }

  openRegister(){
    this.router.navigate(['/register'])
  }

  openCustomDialog(titulo:string, mensage:string, icono:string): void {
    this.modalAlertSrv.openCustomDialog(titulo, mensage, icono)  
  }
}


