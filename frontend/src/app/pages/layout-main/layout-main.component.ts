import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-layout-main',
  standalone: true,
  imports: [HeaderComponent, RouterModule],
  templateUrl: './layout-main.component.html',
  styleUrl: './layout-main.component.css'
})
export class LayoutMainComponent {

}
