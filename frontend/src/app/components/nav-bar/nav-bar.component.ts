import { Component, Input, OnChanges } from '@angular/core';
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
export class NavBarComponent implements OnChanges{
  
  @Input() navigation!: MenuItem[] | null;
  public navWidth: string = '580px';
  
  ngOnChanges(): void {
    this.calculateWidth();
  }

  calculateWidth(): void {
    if (this.navigation) {
      const length = this.navigation.length;
      // Define width based on length, you can adjust these thresholds
      if (length < 3) {
        this.navWidth = '320px';
      }
    }
  }

}
