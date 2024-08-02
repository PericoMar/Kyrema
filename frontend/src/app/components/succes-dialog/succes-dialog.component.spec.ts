import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesDialogComponent } from './succes-dialog.component';

describe('SuccesDialogComponent', () => {
  let component: SuccesDialogComponent;
  let fixture: ComponentFixture<SuccesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuccesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
