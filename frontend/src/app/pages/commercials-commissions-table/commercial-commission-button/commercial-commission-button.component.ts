import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-commercial-commission-button',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './commercial-commission-button.component.html',
  styleUrl: './commercial-commission-button.component.css'
})
export class CommercialCommissionButtonComponent {
  public data: any;

  agInit(params: any): void {
    this.data = params.data;
  }

}
