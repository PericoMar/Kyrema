import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocietyService } from '../../services/society.service';
import { PaymentsComponent } from './payments/payments.component';
import { PricesComponent } from './prices/prices.component';

@Component({
  selector: 'app-payments-and-prices',
  standalone: true,
  imports: [PaymentsComponent, PricesComponent],
  templateUrl: './payments-and-prices.component.html',
  styleUrl: './payments-and-prices.component.css'
})
export class PaymentsAndPricesComponent // implements OnInit 
{
  sociedad : any = {
    nombre : "Kyrema",
    codigo: "001"
  };
  
  constructor(
    private route: ActivatedRoute,
    private societyService: SocietyService
  ) {}

  // ngOnInit(): void {
  //   const codigo = this.route.snapshot.paramMap.get('codigo');
  //   if (codigo) {
  //     this.societyService.getSocietyByCode(codigo).subscribe(
  //       data => {
  //         this.sociedad = data;
  //       },
  //       error => {
  //         console.error('Error fetching society data', error);
  //       }
  //     );
  //   }
  // }


}
