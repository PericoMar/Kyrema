import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AnexosService } from '../../services/anexos.service';
import { SocietyService } from '../../services/society.service';
import { CommonModule } from '@angular/common';
import { DeleteAnexoDialogComponent } from '../../components/delete-anexo-dialog/delete-anexo-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ManagementTableComponent } from '../../components/management-table/management-table.component';


@Component({
  selector: 'app-anexos-manager',
  standalone: true,
  imports: [ CommonModule, DeleteAnexoDialogComponent, ManagementTableComponent],
  templateUrl: './anexos-manager.component.html',
  styleUrl: './anexos-manager.component.css'
})
export class AnexosManagerComponent {
  anexos!: any[];
  displayedColumns: string[] = ['nombre', 'actions'];
  configUrl: string = '/configurador-anexos';
  dataType: string = 'anexo';

  constructor(
    private anexosService: AnexosService,
    private societyService: SocietyService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.anexosService.getAnexosPorSociedad(this.societyService.getCurrentSociety().id).subscribe({
      next: (anexos: any[]) => {
        this.anexos = anexos;
        console.log('Anexos: ', this.anexos);
      },
      error: (error: any) => {
        console.error('Error loading anexos', error);
      }
    });
  }

  openDeleteDialog(data : any){
    this.dialog.open(DeleteAnexoDialogComponent, {
      width: '400px',
      data : {
        id: data.id,
        message: '¿Estás seguro que deseas eliminar el siguiente tipo de anexo?',
        nombre: data.nombre
      },
    });
  }
}
