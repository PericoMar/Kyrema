import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteComercialDialogComponent } from './delete-comercial-dialog.component';

describe('DeleteComercialDialogComponent', () => {
  let component: DeleteComercialDialogComponent;
  let fixture: ComponentFixture<DeleteComercialDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteComercialDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteComercialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
