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


@Component({
  selector: 'app-anexos-manager',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, MatButtonModule, RouterModule, CommonModule, DeleteAnexoDialogComponent],
  templateUrl: './anexos-manager.component.html',
  styleUrl: './anexos-manager.component.css'
})
export class AnexosManagerComponent {
  anexos: any[] = [];
  displayedColumns: string[] = ['nombre', 'actions'];
  anexosForm: FormGroup;

  constructor(
    private anexosService: AnexosService,
    private societyService: SocietyService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.anexosForm = this.fb.group({
      // Define any form controls if needed
    });
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

  deleteAnexo(index: number): void {
    const anexoId = this.anexos[index].id;
    this.anexosService.deleteAnexo(anexoId).subscribe({
      next: () => {
        this.anexos.splice(index, 1); // Remove from UI
        console.log('Anexo deleted successfully');
      },
      error: (error: any) => {
        console.error('Error deleting anexo', error);
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
