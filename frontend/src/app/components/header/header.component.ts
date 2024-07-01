import { Component, Input, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { UserService } from '../../services/user.service';
import { SocietyService } from '../../services/society.service';

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
  imports: [NavBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  user! : User;
  @Input() society! : Society;
  @Input() navigation! : MenuItem[];
  logoUrl! : string | null;

  constructor(
    private userService : UserService,
  ){}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.logoUrl = this.society.logo ? this.society.logo : '../../../assets/logo-kyrema-white.svg';
  }
}
