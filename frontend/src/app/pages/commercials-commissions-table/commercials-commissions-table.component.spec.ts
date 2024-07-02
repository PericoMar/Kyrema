import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialsCommissionsTableComponent } from './commercials-commissions-table.component';

describe('CommercialsCommissionsTableComponent', () => {
  let component: CommercialsCommissionsTableComponent;
  let fixture: ComponentFixture<CommercialsCommissionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommercialsCommissionsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommercialsCommissionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
