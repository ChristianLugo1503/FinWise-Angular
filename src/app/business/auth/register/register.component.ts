import { Component, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export default class RegisterComponent {
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

  constructor(private authService: AuthService, private router: Router){}

  register(): void {
    const {email, password} = this.form().value;
    //console.log(email,password)
    this.authService.login(email, password).subscribe({
      next: (response)=> {
        const token = response.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;
        if(role === 'admin') {
          this.router.navigate(['/dashboard'])
        }else {
          this.router.navigate(['/profile'])
        }
      },
      error: (err) => console.error('Login failed', err)
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

  openLogin(){
    this.router.navigateByUrl('/login');
  }
}
