import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Commercial } from '../../interfaces/commercial';
import path from 'path';
import { SocietyService } from '../../services/society.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../components/error-dialog/error-dialog.component';
import { SuccesDialogComponent } from '../../components/succes-dialog/succes-dialog.component';

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
  sociedades!: any;

  selectedFile!: File;
  fileName!: string;

  requiredInputs : any[] = [
    "nombre",
    "usuario",
    "contraseña",
    "email",
    "dni",
    "fecha_nacimiento"
  ]

  

  constructor(
    private formBuilder: FormBuilder,
    private comercialService: UserService,
    private route : ActivatedRoute,
    private societyService: SocietyService,
    private dialog : MatDialog
  ) {
    this.sociedad = this.societyService.getCurrentSociety();

    this.sociedades = this.societyService.getSociedadesHijas();
    console.log("Sociedades: ", this.sociedades)

    this.route.paramMap.subscribe(params => {
      this.comercial_id = params.get('comercial') || '';
      if(this.comercial_id != ''){
        this.comercialService.getComercialById(this.comercial_id).subscribe(response => {
          console.log('Comercial:', response);
          this.comercial = response;
          this.initializeForm();
        });
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.comercialForm = this.formBuilder.group({
      nombre: [''],
      id_sociedad: [this.sociedad.id],
      usuario: [''],
      email: [''],
      contraseña: [''],
      dni: [''],
      sexo: [''],
      fecha_nacimiento: [''],
      fecha_alta: [''],
      referido: [''],
      direccion: [''],
      poblacion: [''],
      provincia: [''],
      cod_postal: [''],
      telefono: [''],
      fax: [''],
      path_licencia_cazador: [''],
      path_dni: [''],
      path_justificante_iban: [''],
      path_otros: [''],
      path_foto: ['']
    });

    if(this.comercial){
      const updatedComercial = this.transformNullToEmptyString(this.comercial);
      this.comercialForm.patchValue(updatedComercial);
    }
  }

  transformNullToEmptyString(obj: any): any {
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key] === null ? '' : obj[key];
      }
    }
    return result;
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
    const comercial = this.comercialForm.value;
    console.log(comercial);
    if(this.emptyRequiredInput()){

      this.showErrorDialog('Por favor, rellene todos los campos obligatorios');

    } else if(this.dniNotValid()){

      this.showErrorDialog('El DNI introducido no es válido');

    } else {

      if(this.comercial_id == ''){
        
        this.comercialService.createCommercial(comercial).subscribe(response => {
          this.showSuccesDialog('Comercial '+ response.nombre + ' creado correctamente.');
        });

      } else {

        this.comercialService.updateCommercial(this.comercial_id, comercial).subscribe(response => {
          this.showSuccesDialog('Comercial '+ response.nombre + ' actualizado correctamente.');
        });

      }

    }
    
  }

  emptyRequiredInput(){
    // Check if all required inputs are filled
    for(let input of this.requiredInputs){
      if(this.comercialForm.get(input)?.value == ''){
        return true;
      }
    }
    return false;
  }

  dniNotValid(){
    // Usando regex para validar el DNI
    const dni = this.comercialForm.get('dni')?.value;
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    return !dniRegex.test(dni);
  }

  showErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '300px',
      data: { message }
    });
  }


  showSuccesDialog(message: string): void {
    this.dialog.open(SuccesDialogComponent, {
      width: '300px',
      data: { message }
    });
  }
}
