import { ICellRendererParams } from "ag-grid-community";
import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { DeleteSocietyDialogComponent } from "../../../../components/delete-society-dialog/delete-society-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [RouterModule ,MatIcon],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.css'
})
export class ActionButtonsComponent {
  public data: any;

  constructor (
    private dialog: MatDialog
  ) {}

  agInit(params: any): void {
    this.data = params.data;
  }

  refresh(): boolean {
    return false;
  }

  onBorrarClick(data: any) {
    this.dialog.open(DeleteSocietyDialogComponent, {
      width: '400px',
      data : {
        id: data.id,
        message: '¿Estás seguro que deseas eliminar la siguiente sociedad?',
        nombre: data.nombre,
      },
    });
  }
}
