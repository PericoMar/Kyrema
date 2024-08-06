import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAnexoDialogComponent } from './delete-anexo-dialog.component';

describe('DeleteAnexoDialogComponent', () => {
  let component: DeleteAnexoDialogComponent;
  let fixture: ComponentFixture<DeleteAnexoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAnexoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteAnexoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
