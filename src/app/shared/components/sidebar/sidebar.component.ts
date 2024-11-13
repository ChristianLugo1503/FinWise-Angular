import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService){

  }

  logout():void{
    this.authService.logout()
  }

}
