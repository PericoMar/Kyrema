import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
export class NavBarComponent {

  navigation: MenuItem[] = [
    {
      label: 'Administración',
      children: [
        { label: 'Informes', link: '/informes' },
        { label: 'Informes Seguros', link: '/informes-seguros' }
      ]
    },
    {
      label: 'Gestión',
      children: [
        { label: 'Sociedades', link: '/sociedades' },
        { label: 'Tarifas', link: '/tarifas' },
        { label: 'Comisiones', link: '/comisiones' },
        { label: 'Productos', link: '/gestion-productos'}
      ]
    },
    {
      label: 'Productos',
      children: [
        { label: 'Seguros Combinados', link: '/operaciones/seguros-combinados' },
        { label: 'Seguros de Cacerías', link: '/operaciones/seguros-cacerias' },
        { label: 'Seguros Extranjeros', link: '/operaciones/seguros-extranjeros' }
      ]
    }
  ];

}
