import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesActionButtonsComponent } from './companies-action-buttons.component';

describe('CompaniesActionButtonsComponent', () => {
  let component: CompaniesActionButtonsComponent;
  let fixture: ComponentFixture<CompaniesActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesActionButtonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompaniesActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
