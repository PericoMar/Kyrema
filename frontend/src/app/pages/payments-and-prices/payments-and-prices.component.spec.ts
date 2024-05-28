import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsAndPricesComponent } from './payments-and-prices.component';

describe('PaymentsAndPricesComponent', () => {
  let component: PaymentsAndPricesComponent;
  let fixture: ComponentFixture<PaymentsAndPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsAndPricesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentsAndPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
