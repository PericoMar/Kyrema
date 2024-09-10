import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Commercial } from '../../interfaces/commercial';
import { SocietyService } from '../../services/society.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../components/error-dialog/error-dialog.component';
import { SuccesDialogComponent } from '../../components/succes-dialog/succes-dialog.component';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../services/snackBar/snack-bar.service';
import { ButtonSpinnerComponent } from '../../components/button-spinner/button-spinner.component';

@Component({
  selector: 'app-commercial-form',
  standalone: true,
  imports: [MatIconModule,MatButtonModule, ReactiveFormsModule, CommonModule, ButtonSpinnerComponent],
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
  ]
  
  formularioMandado: boolean = false;

  

  constructor(
    private formBuilder: FormBuilder,
    private comercialService: UserService,
    private route : ActivatedRoute,
    private societyService: SocietyService,
    private dialog : MatDialog,
    private snackBarService: SnackBarService
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
      nombre: ['', Validators.required],
      id_sociedad: [this.sociedad.id],
      usuario: ['', Validators.required],
      email: ['', Validators.required],
      contraseña: ['', Validators.required],
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
      this.comercialForm.patchValue(this.comercial);
    } else {
      this.comercialForm.get('fecha_alta')?.setValue(new Date().toISOString().split('T')[0]);
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
    this.formularioMandado = true;
    const comercial = this.comercialForm.value;
    console.log(comercial);
    if(this.comercialForm.valid){

      if(this.comercial_id == ''){
        
        this.comercialService.createCommercial(comercial).subscribe(response => {
          this.snackBarService.openSnackBar('Comercial '+ response.nombre + ' creado correctamente.', 'Cerrar');
          this.formularioMandado = false;
        });

      } else {

        this.comercialService.updateCommercial(this.comercial_id, comercial).subscribe(response => {
          this.snackBarService.openSnackBar('Comercial '+ response.nombre + ' actualizado correctamente.', 'Cerrar');
          this.formularioMandado = false;
        });

      }

    } else {
      this.snackBarService.openSnackBar('Por favor, rellena los campos obligatorios', 'Cerrar');
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
