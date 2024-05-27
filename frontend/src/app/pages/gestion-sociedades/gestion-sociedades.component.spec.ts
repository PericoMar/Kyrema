import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSociedadesComponent } from './gestion-sociedades.component';

describe('GestionSociedadesComponent', () => {
  let component: GestionSociedadesComponent;
  let fixture: ComponentFixture<GestionSociedadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionSociedadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionSociedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
