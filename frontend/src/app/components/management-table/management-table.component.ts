import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-management-table',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, MatButtonModule, RouterModule, SpinnerComponent],
  templateUrl: './management-table.component.html',
  styleUrl: './management-table.component.css'
})
export class ManagementTableComponent {
  @Input() dataToManage! : any[];
  @Input() displayedColumns! : string[];
  @Input() configUrl! : string;
  @Input() dataType! : string;
  @Output() openDeleteDialogEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  openDeleteDialog(data: any) {
    this.openDeleteDialogEvent.emit(data);
  }
}
