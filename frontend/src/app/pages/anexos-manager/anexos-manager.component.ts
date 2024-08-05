import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AnexosService } from '../../services/anexos.service';
import { SocietyService } from '../../services/society.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-anexos-manager',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './anexos-manager.component.html',
  styleUrl: './anexos-manager.component.css'
})
export class AnexosManagerComponent {
  anexos: any[] = [];
  displayedColumns: string[] = ['name', 'actions'];
  anexosForm: FormGroup;

  constructor(
    private anexosService: AnexosService,
    private societyService: SocietyService,
    private fb: FormBuilder
  ) {
    this.anexosForm = this.fb.group({
      // Define any form controls if needed
    });
  }

  ngOnInit(): void {
    this.anexosService.getAnexosPorSociedad(this.societyService.getCurrentSociety().id).subscribe({
      next: (anexos: any[]) => {
        this.anexos = anexos;
        this.anexos = [{id: '1', name: 'Anexo 1', type: 'PDF'}]; // Mock data
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
}
