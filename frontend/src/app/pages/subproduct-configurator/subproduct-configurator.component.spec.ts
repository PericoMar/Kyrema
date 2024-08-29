import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubproductConfiguratorComponent } from './subproduct-configurator.component';

describe('SubproductConfiguratorComponent', () => {
  let component: SubproductConfiguratorComponent;
  let fixture: ComponentFixture<SubproductConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubproductConfiguratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubproductConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
