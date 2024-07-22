import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocietyService } from '../../services/society.service';
import { PaymentsComponent } from './payments/payments.component';
import { PricesComponent } from './prices/prices.component';
import { FamilyProductService } from '../../services/family-product.service'; // Import the FamilyProductService class
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-payments-and-prices',
  standalone: true,
  imports: [PaymentsComponent, PricesComponent, SpinnerComponent],
  templateUrl: './payments-and-prices.component.html',
  styleUrl: './payments-and-prices.component.css'
})
export class PaymentsAndPricesComponent // implements OnInit 
{
  sociedad_id! : string;
  sociedad! : any;
  tiposProducto! : any;
  
  constructor(
    private route: ActivatedRoute,
    private societyService: SocietyService,
    private familyService: FamilyProductService
  ) {}

  ngOnInit(): void {
    const sociedad_id = this.route.snapshot.paramMap.get('sociedad') ? this.route.snapshot.paramMap.get('sociedad') : '';
    console.log(sociedad_id)
    if (sociedad_id != null) {
      this.sociedad_id = sociedad_id;
    }
    if (this.sociedad_id) {
      this.societyService.getSocietyById(this.sociedad_id).subscribe(
        data => {
          console.log(data);
          this.sociedad = data;
        },
        error => {
          console.error('Error cogiendo la sociedad por id', error);
        }
      );
    }
  }


}
