import { Component, Input, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { UserService } from '../../services/user.service';
import { SocietyService } from '../../services/society.service';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';
import { ActivatedRoute,  Router } from '@angular/router';

interface User {
  id: string,
  nombre: string,
  usuario: string,
  nivel: string,
  id_sociedad: string
}

interface Society {
  nombre : string,
  codigo_postal : string,
  poblacion :string,
  tipo_sociedad: string,
  nivel_sociedad: string,
  logo: string,
  sociedad_padre_id: string,
  created_at: string,
  updated_at: string;
  codigo_sociedad : string
}

interface MenuItem {
  label: string;
  children?: MenuItem[];
  link?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavBarComponent, MatIcon, LogoutDialogComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  user! : User;
  @Input() society! : Society;
  @Input() navigation! : MenuItem[];
  logoUrl! : string | null;
  comercial_id!: string;

  constructor(
    private userService : UserService,
    private dialog: MatDialog,
  ){
    
  }

  ngOnInit(): void {
      this.logoUrl = this.society.logo ? this.society.logo : '../../../assets/Logo_CANAMA__003.png';
      this.user = this.userService.getCurrentUser();
  }

  logout(){
    this.dialog.open(LogoutDialogComponent, {
      width: '400px',
      data : {},
    });
  }
}
