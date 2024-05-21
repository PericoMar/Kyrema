import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface MenuItem {
  label: string;
  children?: MenuItem[];
  link?: string;
  show?: boolean; // Añadir esta propiedad para manejar el estado del menú
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  navigation: MenuItem[] = [
    {
      label: 'Administración',
      show: false,
      children: [
        { label: 'Informes', link: '/informes' },
        { label: 'Informes Seguros', link: '/informes-seguros' }
      ]
    },
    {
      label: 'Gestión',
      show: false,
      children: [
        { label: 'Sociedades', link: '/sociedades' },
        { label: 'Tarifas', link: '/tarifas' },
        { label: 'Comisiones', link: '/comisiones' }
      ]
    },
    {
      label: 'Productos',
      show: false,
      children: [
        { label: 'Seguros Combinados', link: '/seguros-combinados' },
        { label: 'Seguros de Cacerías', link: '/seguros-cacerias' },
        { label: 'Seguros Extranjeros', link: '/seguros-extranjeros' }
      ]
    }
  ];
}
