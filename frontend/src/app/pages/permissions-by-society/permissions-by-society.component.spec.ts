import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsBySocietyComponent } from './permissions-by-society.component';

describe('PermissionsBySocietyComponent', () => {
  let component: PermissionsBySocietyComponent;
  let fixture: ComponentFixture<PermissionsBySocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionsBySocietyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermissionsBySocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
