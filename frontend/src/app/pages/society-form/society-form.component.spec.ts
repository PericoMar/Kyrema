import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyFormComponent } from './society-form.component';

describe('SocietyFormComponent', () => {
  let component: SocietyFormComponent;
  let fixture: ComponentFixture<SocietyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocietyFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocietyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
