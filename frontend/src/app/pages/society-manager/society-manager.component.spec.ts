import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyManagerComponent } from './society-manager.component';

describe('SocietyManagerComponent', () => {
  let component: SocietyManagerComponent;
  let fixture: ComponentFixture<SocietyManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocietyManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocietyManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
