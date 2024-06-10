import { ICellRendererParams } from "ag-grid-community";
import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [RouterModule ,MatIcon],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.css'
})
export class ActionButtonsComponent {
  public data: any;

  agInit(params: any): void {
    this.data = params.data;
  }

  refresh(): boolean {
    return false;
  }

  onBorrarClick(data: any) {
    // Implementa la lógica de borrado
    console.log('Borrar:', data);
  }
}
