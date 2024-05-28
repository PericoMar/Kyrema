import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyTableComponent } from './society-table.component';

describe('SocietyTableComponent', () => {
  let component: SocietyTableComponent;
  let fixture: ComponentFixture<SocietyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocietyTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocietyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
