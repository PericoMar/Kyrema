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
  imports: [NavBarComponent, MatIcon, LogoutDialogComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  @Input() user! : User;
  @Input() society! : Society;
  @Input() navigation! : MenuItem[] | null;
  logoUrl! : string | null;
  comercial_id!: string;

  constructor(
    private userService : UserService,
    private dialog: MatDialog,
  ){
    
  }

  ngOnInit(): void {
      this.logoUrl = this.society.logo ? AppConfig.STORAGE_URL + this.society.logo : '../../../assets/Logo_CANAMA__003.png';
      // this.user = this.userService.getCurrentUser();
  }

  logout(){
    this.dialog.open(LogoutDialogComponent, {
      width: '400px',
      data : {},
    });
  }
}
