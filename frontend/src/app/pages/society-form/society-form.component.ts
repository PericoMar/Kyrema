import { Component } from '@angular/core';
import { Society } from '../../interfaces/society';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocietyService } from '../../services/society.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '../../../config/app-config';

@Component({
  selector: 'app-society-form',
  standalone: true,
  imports: [MatIconModule,MatButtonModule, ReactiveFormsModule],
  templateUrl: './society-form.component.html',
  styleUrl: './society-form.component.css'
})
export class SocietyFormComponent {
  sociedad! : Society;
  sociedad_id!: string;
  societyForm!: FormGroup;
  tiposDeSociedad = ['Sociedad de caza', 'Sociedad dependiente'];
  sociedad_padre_id: string;
  sociedadesPadre: Society[] = [];

  selectedFile!: File;
  fileName!: string;


  constructor(
    private formBuilder: FormBuilder,
    private societyService: SocietyService,
    private router : Router,
    private route : ActivatedRoute
  ) {
    

    this.sociedad_padre_id = this.societyService.getCurrentSociety().id || '';

    if(this.sociedad_padre_id == AppConfig.SOCIEDAD_ADMIN_ID){
      this.societyService.getSociedadesPadres().subscribe(response => {
        console.log('Sociedades padre:', response);
        this.sociedadesPadre = response;
      });
    }

    // Coger la sociedad por la ruta:
    this.route.paramMap.subscribe(params => {
      this.sociedad_id = params.get('sociedad') || '';
    });

  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.societyForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      cif: [''],
      correo_electronico: ['', [Validators.required, Validators.email]],
      tipo_sociedad: [this.tiposDeSociedad[0], Validators.required],
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
    if(this.sociedad_id){
      this.societyService.getSocietyById(this.sociedad_id).subscribe(response => {
        // PatchValues para rellenar el formulario con los datos de la sociedad.
        this.societyForm.patchValue(response);
      });
    } 
    
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
      if(this.sociedad_id == ''){
        this.societyService.createSociety(nuevaSociedad).subscribe(response => {
          console.log('Sociedad creada:', response);

          this.societyService.getSociedadAndHijas(this.sociedad_padre_id).subscribe(response => {
            this.societyService.guardarSociedadesEnLocalStorage(response);
    
            this.router.navigate(['/sociedades']);

          });
          // Conectar los tipos de producto de la sociedad padre con la nueva sociedad.
          this.societyService.connectTipoProductoFromSocietyToAnother(this.sociedad_padre_id, response.id).subscribe(response => {
            console.log('Tipos de producto conectados:', response);
          });
          
        }, 
        error => {
          console.error('Error al crear la sociedad:', error);
        });
      } else {
        this.societyService.updateSociety(this.sociedad_id, nuevaSociedad).subscribe(response => {
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


