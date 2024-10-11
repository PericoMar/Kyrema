import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolizasActionButtonsComponent } from './polizas-action-buttons.component';

describe('PolizasActionButtonsComponent', () => {
  let component: PolizasActionButtonsComponent;
  let fixture: ComponentFixture<PolizasActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolizasActionButtonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PolizasActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
