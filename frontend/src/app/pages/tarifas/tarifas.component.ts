import { Component } from '@angular/core';
import { PricesComponent } from '../payments-and-prices/prices/prices.component';
@Component({
  selector: 'app-tarifas',
  standalone: true,
  imports: [PricesComponent],
  templateUrl: './tarifas.component.html',
  styleUrl: './tarifas.component.css'
})
export class TarifasComponent {
  sociedad_admin_id = '1';

  infoText : string = "Nota: Los precios que establezca en este formulario se aplicarán en todas las sociedades.";
  infoClass : string = "info-message alert";


}
