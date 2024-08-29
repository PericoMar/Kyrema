import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubproductManagerComponent } from './subproduct-manager.component';

describe('SubproductManagerComponent', () => {
  let component: SubproductManagerComponent;
  let fixture: ComponentFixture<SubproductManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubproductManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubproductManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
