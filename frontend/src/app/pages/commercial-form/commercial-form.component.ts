import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { AppConfig } from '../../../config/app-config';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-commercial-form',
  standalone: true,
  imports: [MatIconModule,MatButtonModule, ReactiveFormsModule, CommonModule, ButtonSpinnerComponent],
  templateUrl: './commercial-form.component.html',
  styleUrl: './commercial-form.component.css'
})
export class CommercialFormComponent {
  comercialForm!: FormGroup;

  existingUsernames: string[] = [];
  comercial_id!: string;
  comercial! : Commercial;
  sociedad!: any;
  sociedad_id!: any;
  sociedades!: any;

  selectedFile!: File;
  fileName!: string;

  requiredInputs : any[] = [
    "nombre",
    "usuario",
    "contraseña",
    "email",
    "responsable",
    "fecha_nacimiento",
  ]
  
  formularioMandado: boolean = false;
  id_sociedad_admin: any;
  cargandoComercial: boolean = false;

  

  constructor(
    private formBuilder: FormBuilder,
    private comercialService: UserService,
    private route : ActivatedRoute,
    private societyService: SocietyService,
    private dialog : MatDialog,
    private snackBarService: SnackBarService,
  ) {
    this.id_sociedad_admin = AppConfig.SOCIEDAD_ADMIN_ID;

    this.sociedad = this.societyService.getCurrentSociety();
    this.sociedad_id = this.sociedad.id;

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
    this.comercialService.getAllUsers().subscribe({
      next: (response : any) => {
        this.existingUsernames = response.map((user: any) => user.usuario);
        this.initializeForm();
      },
      error: (error: any) => {
        console.error(error);
      }
      }
    )
    
  }

  private initializeForm() {
    this.comercialForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      id_sociedad: [this.sociedad.id],
      usuario: ['', [Validators.required, CustomValidators.userNameNotTaken(this.existingUsernames)]],
      email: ['', Validators.required],
      responsable: ['0', Validators.required],
      contraseña: ['', [Validators.required, CustomValidators.passwordValidator]],
      dni: [''],
      sexo: [''],
      fecha_nacimiento: ['', Validators.required],
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
    console.log(this.comercialForm);
    this.formularioMandado = true;
    this.cargandoComercial = true;
    const comercial = this.comercialForm.value;
    console.log(comercial);

    const passwordControl = this.comercialForm.get('contraseña');

    // Verificamos si hay errores en la contraseña
    if (passwordControl?.invalid) {
      this.snackBarService.openSnackBar(
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial.',
        'Cerrar'
      );
      this.cargandoComercial = false;
      return;
    }

    // Verificamos si el formulario es válido en general
    if (this.comercialForm.valid) {
      if (this.comercial_id == '') {
        this.comercialService.createCommercial(comercial).subscribe(response => {
          this.snackBarService.openSnackBar('Comercial ' + response.nombre + ' creado correctamente.', 'Cerrar');
          this.formularioMandado = false;
          this.cargandoComercial = false;
        });
      } else {
        this.comercialService.updateCommercial(this.comercial_id, comercial).subscribe(response => {
          this.snackBarService.openSnackBar('Comercial ' + response.nombre + ' actualizado correctamente.', 'Cerrar');
          this.formularioMandado = false;
          this.cargandoComercial = false;
        });
      }
    } else {
      this.snackBarService.openSnackBar('Por favor, rellena los campos obligatorios', 'Cerrar');
      this.cargandoComercial = false;
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
