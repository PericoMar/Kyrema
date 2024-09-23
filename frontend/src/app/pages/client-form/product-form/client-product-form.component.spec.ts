import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProductFormComponent } from './client-product-form.component';

describe('ClientProductFormComponent', () => {
  let component: ClientProductFormComponent;
  let fixture: ComponentFixture<ClientProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientProductFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
