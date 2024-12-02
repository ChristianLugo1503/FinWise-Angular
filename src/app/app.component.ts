import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'ng-menu-dashboard';

  constructor( private authService: AuthService) {

  }

  ngOnInit(): void {
   if(this.authService.isAuthenticated()) {
    this.authService.autoRefreshToken()
   }
  }
}
