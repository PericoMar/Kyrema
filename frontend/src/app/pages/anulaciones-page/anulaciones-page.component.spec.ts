import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnulacionesPageComponent } from './anulaciones-page.component';

describe('AnulacionesPageComponent', () => {
  let component: AnulacionesPageComponent;
  let fixture: ComponentFixture<AnulacionesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnulacionesPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnulacionesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
