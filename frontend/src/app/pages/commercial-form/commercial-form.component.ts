import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Commercial } from '../../interfaces/commercial';
import path from 'path';
import { SocietyService } from '../../services/society.service';

@Component({
  selector: 'app-commercial-form',
  standalone: true,
  imports: [MatIconModule,MatButtonModule, ReactiveFormsModule],
  templateUrl: './commercial-form.component.html',
  styleUrl: './commercial-form.component.css'
})
export class CommercialFormComponent {
  comercialForm!: FormGroup;

  comercial_id!: string;
  comercial! : Commercial;
  sociedad!: any;

  selectedFile!: File;
  fileName!: string;

  constructor(
    private formBuilder: FormBuilder,
    private comercialService: UserService,
    private route : ActivatedRoute,
    private societyService: SocietyService
  ) {
    this.sociedad = this.societyService.getCurrentSociety();

    this.route.paramMap.subscribe(params => {
      this.comercial_id = params.get('comercial') || '';
      this.comercialService.getComercialById(this.comercial_id).subscribe(response => {
        console.log('Comercial:', response);
        this.comercial = response;
      });
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.comercialForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      id_sociedad: [this.sociedad.id, Validators.required],
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
      dni: ['', Validators.required],
      sexo: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      fecha_alta: ['', Validators.required],
      referido: ['', Validators.required],
      direccion: ['', Validators.required],
      poblacion: ['', Validators.required],
      provincia: ['', Validators.required],
      cod_postal: ['', Validators.required],
      telefono: ['', Validators.required],
      fax: ['', Validators.required],
      path_licencia_cazador: ['', Validators.required],
      path_dni: ['', Validators.required],
      path_justificante_iban: ['', Validators.required],
      path_otros: ['', Validators.required],
      path_foto: ['', Validators.required]
    });

    if(this.comercial){
      this.comercialForm.patchValue(this.comercial);
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
    if(this.comercialForm.valid){
      const comercial = this.comercialForm.value;

      if(this.comercial_id == ''){
        this.comercialService.createCommercial(comercial).subscribe(response => {
          console.log('Comercial creado:', response);
        });
      } else {
        this.comercialService.updateCommercial(this.comercial_id, comercial).subscribe(response => {
          console.log('Comercial actualizado:', response);
        });


      }
    }
  }
}
