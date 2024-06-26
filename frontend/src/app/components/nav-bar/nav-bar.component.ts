import { Component, OnInit } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { UserService } from '../../services/user.service';

interface MenuItem {
  label: string;
  children?: MenuItem[];
  link?: string;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{

  currentUser! : any;
  navigation!: MenuItem[] 

  constructor (
    private navService : NavService,
    private userService : UserService
  ){}
  
  ngOnInit(){
    this.currentUser = this.userService.getCurrentUser();
    console.log(this.currentUser);
    this.navService.getNavegation(this.currentUser.nivel).subscribe(
      data => {
        this.navigation = data;
        console.log(this.navigation)
      },
      (error) => {
        console.error('Error fetching navigation:', error);
      }
    );
  }

}
