import { Component, Input, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { UserService } from '../../services/user.service';
import { SocietyService } from '../../services/society.service';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';
import { ActivatedRoute,  Router } from '@angular/router';
import { Society } from '../../interfaces/society';
import { AppConfig } from '../../../config/app-config';
import { CommonModule } from '@angular/common';
import { MatMenu, MatMenuModule } from '@angular/material/menu';

interface User {
  id: string,
  nombre: string,
  usuario: string,
  nivel: string,
  id_sociedad: string
}

interface MenuItem {
  label: string;
  children?: MenuItem[];
  link?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavBarComponent, MatIcon, LogoutDialogComponent, CommonModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  @Input() user! : User;
  @Input() society! : Society;
  @Input() logoSocietySecondLevel! : string;
  @Input() navigation! : MenuItem[] | null;
  profileLogoUrl : string | null = '';
  comercial_id!: string;

  constructor(
    private userService : UserService,
    private dialog: MatDialog,
  ){
    
  }

  ngOnInit(): void {
    console.log('User:', this.society);
    this.profileLogoUrl = this.society.logo ? AppConfig.STORAGE_URL + this.society.logo : "https://kyrema.es/dist/panel-gestion/images/users/avatar-1.jpg";
    // this.user = this.userService.getCurrentUser();
  }

  logout(){
    this.dialog.open(LogoutDialogComponent, {
      width: '400px',
      data : {},
    });
  }
}
