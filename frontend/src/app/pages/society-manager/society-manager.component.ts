import { Component } from '@angular/core';
import { SocietyTableComponent } from './society-table/society-table.component';

@Component({
  selector: 'app-society-manager',
  standalone: true,
  imports: [SocietyTableComponent],
  templateUrl: './society-manager.component.html',
  styleUrl: './society-manager.component.css'
})
export class SocietyManagerComponent {

}
