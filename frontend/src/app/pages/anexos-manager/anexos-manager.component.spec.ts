import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnexosManagerComponent } from './anexos-manager.component';

describe('AnexosManagerComponent', () => {
  let component: AnexosManagerComponent;
  let fixture: ComponentFixture<AnexosManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnexosManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnexosManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
