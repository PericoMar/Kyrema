import { Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { SocietyTableComponent } from '../../components/society-table/society-table.component';

@Component({
  selector: 'app-gestion-sociedades',
  standalone: true,
  imports: [SocietyTableComponent],
  templateUrl: './gestion-sociedades.component.html',
  styleUrl: './gestion-sociedades.component.css'
})
export class GestionSociedadesComponent {

}
