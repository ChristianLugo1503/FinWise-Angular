import { Component, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  form = signal<FormGroup>(
    new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      password: new FormControl('', [Validators.required])
    })
  );

  constructor(private authService: AuthService, private router: Router){}

  login(): void {
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

  hasRequiredError(fiel: string){
    const control = this.form().get(fiel);
    return control?.hasError('required') && control.touched
  }

  openRegister(){
    this.router.navigate(['/register'])
  }

}


