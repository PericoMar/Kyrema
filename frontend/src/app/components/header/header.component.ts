import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

interface User {
  nombre: string,
  correo: string
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  user : User = {
    nombre: "admin",
    correo: "admin@admin.com"
  }
}
