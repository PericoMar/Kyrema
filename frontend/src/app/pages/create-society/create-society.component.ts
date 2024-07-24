import { Component } from '@angular/core';
import { Society } from '../../interfaces/society';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocietyService } from '../../services/society.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-society',
  standalone: true,
  imports: [MatIconModule,MatButtonModule],
  templateUrl: './create-society.component.html',
  styleUrl: './create-society.component.css'
})
export class CreateSocietyComponent {
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
    this.sociedad_padre_id = this.societyService.getSociedadIdPorUrl();
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
      this.societyService.createSociety(nuevaSociedad).subscribe(response => {
        console.log('Sociedad creada:', response);
      });
    } else {
      console.log('Formulario no válido');
    }
  }
}
