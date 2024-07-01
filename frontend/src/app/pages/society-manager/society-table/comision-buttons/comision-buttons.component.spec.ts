import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionButtonsComponent } from './comision-buttons.component';

describe('ComisionButtonsComponent', () => {
  let component: ComisionButtonsComponent;
  let fixture: ComponentFixture<ComisionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComisionButtonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComisionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
