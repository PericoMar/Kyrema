import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnexosConfiguratorComponent } from './anexos-configurator.component';

describe('AnexosConfiguratorComponent', () => {
  let component: AnexosConfiguratorComponent;
  let fixture: ComponentFixture<AnexosConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnexosConfiguratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnexosConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
