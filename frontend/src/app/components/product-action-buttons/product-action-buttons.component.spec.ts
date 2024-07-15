import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductActionButtonsComponent } from './product-action-buttons.component';

describe('ProductActionButtonsComponent', () => {
  let component: ProductActionButtonsComponent;
  let fixture: ComponentFixture<ProductActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductActionButtonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
