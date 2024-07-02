import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialCommissionButtonComponent } from './commercial-commission-button.component';

describe('CommercialCommissionButtonComponent', () => {
  let component: CommercialCommissionButtonComponent;
  let fixture: ComponentFixture<CommercialCommissionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommercialCommissionButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommercialCommissionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
