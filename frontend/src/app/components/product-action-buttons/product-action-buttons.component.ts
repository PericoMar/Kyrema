import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-action-buttons',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './product-action-buttons.component.html',
  styleUrl: './product-action-buttons.component.css'
})
export class ProductActionButtonsComponent {
  public data: any;

  agInit(params: any): void {
    this.data = params.data;
  }

}
