import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSocietyDialogComponent } from './delete-society-dialog.component';

describe('DeleteSocietyDialogComponent', () => {
  let component: DeleteSocietyDialogComponent;
  let fixture: ComponentFixture<DeleteSocietyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSocietyDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSocietyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
