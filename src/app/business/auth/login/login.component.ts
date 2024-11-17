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
      email: new FormControl('', [Validators.required, Validators.email]),
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

  hasRequiredError(fiel: string){
    const control = this.form().get(fiel);
    return control?.hasError('required') && control.touched
  }

}


