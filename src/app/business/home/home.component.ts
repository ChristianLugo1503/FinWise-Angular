import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataUserService } from '../../core/services/data-user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {
  activeTab: string = 'Gastos'; 
  name: any;
  user: any;
  
  constructor(
    private dataUserService: DataUserService
  ){
    this.dataUserService.getUserData().subscribe({
      next: data =>{
        this.name = data.name;
        console.log('name',this.name)
      },
      error: error => {
        console.error(error);
      }
    })
  };
  
  
  setActiveTab(tab: string): void {
    this.activeTab = tab; 
  }



  // getUserData():void{
  //   this.dataUserService.loadUserData().subscribe({
  //     next:(response) => {
  //       console.log(response)
  //       this.name = response.name;
  //       console.log(this.name)
  //     },
  //     error:(error) =>{
  //       console.error(error);
  //     }
  //   })
  // }
}
