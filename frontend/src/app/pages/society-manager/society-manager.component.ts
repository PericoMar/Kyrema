import { Component } from '@angular/core';
import { SocietyTableComponent } from './society-table/society-table.component';
import { RouterModule } from '@angular/router';
import { SocietyService } from '../../services/society.service';
import { Society } from '../../interfaces/society';

@Component({
  selector: 'app-society-manager',
  standalone: true,
  imports: [SocietyTableComponent, RouterModule],
  templateUrl: './society-manager.component.html',
  styleUrl: './society-manager.component.css'
})
export class SocietyManagerComponent {
  currentSociety!: Society;

  constructor (
    private societyService: SocietyService
  ) {
    this.currentSociety = this.societyService.getCurrentSociety();
  }
}
