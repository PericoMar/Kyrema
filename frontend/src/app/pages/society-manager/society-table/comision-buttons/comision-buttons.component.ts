import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comision-buttons',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './comision-buttons.component.html',
  styleUrl: './comision-buttons.component.css'
})
export class ComisionButtonsComponent {
  public data: any;

  agInit(params: any): void {
    this.data = params.data;
  }

}
