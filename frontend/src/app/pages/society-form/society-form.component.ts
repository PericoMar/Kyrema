import { Component } from '@angular/core';
import { Society } from '../../interfaces/society';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocietyService } from '../../services/society.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-society-form',
  standalone: true,
  imports: [MatIconModule,MatButtonModule, ReactiveFormsModule],
  templateUrl: './society-form.component.html',
  styleUrl: './society-form.component.css'
})
export class SocietyFormComponent {
  id_sociedad_formulario!: string;
  sociedad! : Society;
  societyForm!: FormGroup;
  tiposDeSociedad = ['Sociedad de caza', 'Sociedad dependiente'];
  sociedad_padre_id: string;

  selectedFile!: File;
  fileName!: string;


  constructor(
    private formBuilder: FormBuilder,
    private societyService: SocietyService
  ) {
    this.sociedad_padre_id = this.societyService.getCurrentSociety().id || '';

    this.societyService.getSociedadesHijas();

    this.id_sociedad_formulario = this.societyService.getSociedadIdPorUrl();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.societyForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      cif: [''],
      correo_electronico: ['', [Validators.required, Validators.email]],
      tipo_sociedad: ['', Validators.required],
      direccion: [''],
      poblacion: [''],
      pais: [''],
      codigo_postal: [''],
      codigo_sociedad: [''],
      telefono: [''],
      fax: [''],
      movil: [''],
      iban: [''],
      banco: [''],
      sucursal: [''],
      dc: [''],
      numero_cuenta: [''],
      swift: [''],
      dominio: [''],
      observaciones: [''],
      logo: [''],
      sociedad_padre_id: [this.sociedad_padre_id]
    });
  }

  onFileSelected(event : any) {

    const file:File = event.target.files.item(0);
    this.selectedFile = file;

    if (file) {

        this.fileName = file.name;

        console.log(this.fileName);
    }
  }

  onSubmit() {
    if (this.societyForm.valid) {
      const nuevaSociedad: Society = this.societyForm.value;
      if(this.id_sociedad_formulario == ''){
        this.societyService.createSociety(nuevaSociedad).subscribe(response => {
          console.log('Sociedad creada:', response);
          this.societyService.getSociedadAndHijas(this.sociedad_padre_id).subscribe(response => {
            this.societyService.guardarSociedadesEnLocalStorage(response);
          });
          // Conectar los tipos de producto de la sociedad padre con la nueva sociedad.
          
        }, 
        error => {
          console.error('Error al crear la sociedad:', error);
        });
      } else {
        this.societyService.updateSociety(this.id_sociedad_formulario, nuevaSociedad).subscribe(response => {
          console.log('Sociedad actualizada:', response);
          this.societyService.getSociedadAndHijas(this.sociedad_padre_id).subscribe(response => {
            this.societyService.guardarSociedadesEnLocalStorage(response);
          });
        }, 
        error => {
          console.error('Error al actualizar la sociedad:', error);
        });
      }
      
    } else {
      console.log('Formulario no válido');
    }
  }
}


