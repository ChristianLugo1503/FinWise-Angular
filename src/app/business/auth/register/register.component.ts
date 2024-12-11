import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../shared/components/modales/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DataUserService } from '../../../core/services/dataUser/data-user.service';
import { ModalAlertService } from '../../../core/services/alert/modal-alert.service';


@Component({
    selector: 'app-register',
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export default class RegisterComponent {
  private modalAlertSrv = inject(ModalAlertService);

  form = signal<FormGroup>(
    new FormGroup({
      name: new FormControl('',[
        Validators.required
      ]),
      lastname: new FormControl('',[
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]),
      confPassword: new FormControl('',[
        Validators.required,
      ])
    })
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    public dataUserService: DataUserService
  ){}

  register(): void {
    const {name, lastname, email, password} = this.form().value;
    this.authService.register({name, lastname, email, password}).subscribe({
      next: (response)=> {
        const token = response.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;
        localStorage.setItem('Email',payload.sub);

        this.dataUserService.loadUserData().subscribe({
          next: (response) => {
            //console.log('Datos del usuario cargados:', response);
          },
          error: (error) => {
            console.error('Error al cargar datos del usuario:', error);
          },
        });

        if(role === 'admin') {
          this.router.navigate(['/dashboard'])
        }else {
          this.router.navigate(['/profile'])
        }
      },
      error: (err) => {
        if (err.status === 401 && err.error?.error) {
          if(err.error.error === 'Email exist'){
            this.openCustomDialog('Error','El correo electrónico proporcionado ya está asociado a una cuenta. Por favor, utiliza un correo diferente o inicia sesión con tus credenciales existentes.','error');
          }
        } else {
          console.error('Unexpected error:', err);
          this.openCustomDialog('Error','Se ha producido un error inesperado. Inténtelo de nuevo más tarde.','error');
        }
      }
    })
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

  checkPassword():string{
    const control = this.form().get('password');
    if (control?.hasError('required') && control.touched) {
      return 'Contraseña requerida!';
    }else if(control?.hasError('pattern')){
      return 'La contraseña debe tener al menos 6 caracteres, incluyendo una letra mayúscula, una letra minúscula y un número.';
    }else{
      return '';
    }
  }

  checkconfPassword(): string {
    const password = this.form().get('password')?.value; // Obtiene el valor del control 'password'
    const control = this.form().get('confPassword'); // Obtiene el control 'confPassword'
    
    if (control?.hasError('required') && control.touched) {
      return 'Confirmar la contraseña es requerido!';
    } else if (password !== control?.value) { // Compara los valores de 'password' y 'confPassword'
      return 'Las contraseñas no coinciden';
    } else {
      return '';
    }
  }

  hasRequiredError(fiel:string):boolean{
    const control = this.form().get(fiel);
    if(control?.hasError('required') && control.touched){
      return true
    }else{

      return false
    }
  }

  openCustomDialog(titulo:string, mensage:string, icono:string): void {
    this.modalAlertSrv.openCustomDialog(titulo, mensage, icono)  
  }

  openLogin(){
    this.router.navigateByUrl('/login');
  }
}
