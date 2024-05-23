import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOperationsComponent } from './product-operations.component';

describe('ProductOperationsComponent', () => {
  let component: ProductOperationsComponent;
  let fixture: ComponentFixture<ProductOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductOperationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
