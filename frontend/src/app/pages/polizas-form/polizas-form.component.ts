import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CompaniesService } from '../../services/companies/companies.service';
import { PolizasService } from '../../services/polizas/polizas.service';
import { ButtonSpinnerComponent } from '../../components/button-spinner/button-spinner.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-polizas-form',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, ButtonSpinnerComponent, CommonModule],
  templateUrl: './polizas-form.component.html',
  styleUrl: './polizas-form.component.css'
})
export class PolizasFormComponent {
  polizaForm: FormGroup;
  companias: any[] = []; // Aquí deberías definir el tipo correcto
  formularioMandado: boolean = false; // Para validar si el formulario fue enviado
  cargandoPoliza: boolean = false; // Para mostrar un spinner mientras se carga
  poliza_id: number | null = null; // Para saber si se está editando una póliza
  fileNames: string[] = Array(6).fill('');
  
  // Array para los controles de documentos adjuntos
  documentosAdjuntos = ['doc_adjuntos_1', 'doc_adjuntos_2', 'doc_adjuntos_3', 'doc_adjuntos_4', 'doc_adjuntos_5', 'doc_adjuntos_6'];


  

  constructor(private fb: FormBuilder, private companyService: CompaniesService, private polizasService: PolizasService, private route: ActivatedRoute) { 
    this.polizaForm = this.fb.group({
      compania_id: [null, Validators.required],
      numero: ['', Validators.required],
      ramo: ['', Validators.required],
      descripcion: [''],
      prima_neta: [null, Validators.required],
      impuestos: [null, Validators.required],
      fecha_inicio: [null, Validators.required],
      fecha_fin_venta: [null, Validators.required],
      fecha_fin_servicio: [null, Validators.required],
      estado: [''],
      doc_adjuntos_1: [''],
      doc_adjuntos_2: [''],
      doc_adjuntos_3: [''],
      doc_adjuntos_4: [''],
      doc_adjuntos_5: [''],
      doc_adjuntos_6: [''],
      comentarios: [''],
    });
  }

  ngOnInit(): void {
    this.loadCompanias();
    this.route.paramMap.subscribe(params => {
      this.poliza_id = parseInt(params.get('id') || '');
      if (this.poliza_id) {
        this.loadPoliza(this.poliza_id);
      }
    });
    
  }

  loadCompanias(): void {
    this.companyService.getCompanies().subscribe((data : any) => {
      this.companias = data;
    });
  }

  loadPoliza(id: number): void {
    this.polizasService.getPolizaById(id).subscribe((data : any) => {
      this.polizaForm.patchValue(data);
    });
  }

  onSubmit(): void {
    this.formularioMandado = true;
    if (this.polizaForm.invalid) {
      return;
    }

    this.cargandoPoliza = true;

    if (this.poliza_id) {
      // Actualizar póliza existente
      this.polizasService.updatePoliza(this.poliza_id, this.polizaForm.value).subscribe(() => {
        this.cargandoPoliza = false;
        // Manejar éxito, tal vez redirigir o mostrar un mensaje
      });
    } else {
      // Crear nueva póliza
      this.polizasService.createPoliza(this.polizaForm.value).subscribe(() => {
        this.cargandoPoliza = false;
        // Manejar éxito, tal vez redirigir o mostrar un mensaje
      });
    }
  }

  // Método que maneja la selección del archivo
  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.fileNames[index - 1] = file.name;
    }
  }
}
