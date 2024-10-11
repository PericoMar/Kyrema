import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackBarService } from '../../services/snackBar/snack-bar.service';
import { CompaniesService } from '../../services/companies/companies.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ButtonSpinnerComponent } from '../../components/button-spinner/button-spinner.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-companies-form',
  standalone: true,
  imports: [MatIconModule,MatButtonModule, ReactiveFormsModule, ButtonSpinnerComponent, CommonModule],
  templateUrl: './companies-form.component.html',
  styleUrl: './companies-form.component.css'
})
export class CompaniesFormComponent {
  companyForm!: FormGroup;
  loadingCompany: boolean = false;
  company_id: number | null = null;
  formSubmitted: boolean = false;
  fileName: string = '';
  selectedFile!: File;
  
  constructor(
    private fb: FormBuilder,
    private companyService: CompaniesService,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.route.paramMap.subscribe(params => {
      this.company_id = parseInt(params.get('id') || '');
      if (this.company_id) {
        this.loadCompanyDetails();
      }
    });
  }

  // Inicialización del formulario
  initializeForm(): void {
    this.companyForm = this.fb.group({
      nombre: ['', Validators.required],
      CIF: ['', Validators.required],
      IBAN: ['', Validators.required],
      logo: [null],
      nombre_contacto_1: [''],
      cargo_contacto_1: [''],
      email_contacto_1: ['', [Validators.email]],
      telefono_contacto_1: [''],
      nombre_contacto_2: [''],
      cargo_contacto_2: [''],
      email_contacto_2: ['', [Validators.email]],
      telefono_contacto_2: [''],
      nombre_contacto_3: [''],
      cargo_contacto_3: [''],
      email_contacto_3: ['', [Validators.email]],
      telefono_contacto_3: [''],
      nombre_contacto_4: [''],
      cargo_contacto_4: [''],
      email_contacto_4: ['', [Validators.email]],
      telefono_contacto_4: [''],
      nombre_contacto_5: [''],
      cargo_contacto_5: [''],
      email_contacto_5: ['', [Validators.email]],
      telefono_contacto_5: [''],
      comentarios: ['']
    });
  }

  // Método para cargar los detalles de la empresa (si es una edición)
  loadCompanyDetails(): void {
    this.loadingCompany = true;
    this.companyService.getCompanyById(this.company_id!).subscribe(
      (data : any) => {
        this.companyForm.patchValue(data);
        this.fileName = data.logo ? 'Logo uploaded' : '';
        this.loadingCompany = false;
      },
      (error) => {
        this.snackBarService.openSnackBar('Error cargando los datos de la compañia', 'Cerrar');
        this.loadingCompany = false;
      }
    );
  }

  // Manejo de envío del formulario
  onSubmit(): void {
    this.formSubmitted = true;

    if (this.companyForm.invalid) {
      this.snackBarService.openSnackBar('Porfavor, complete todos los campos obligatorios.', 'Cerrar');
      return;
    }

    this.loadingCompany = true;

    const nuevaCompania = this.companyForm.value;

    // Diferenciar entre creación y edición
    if (this.company_id) {
      this.companyService.updateCompany(this.company_id, nuevaCompania).subscribe(
        (response) => {
          this.snackBarService.openSnackBar('Compañía actualizada correctamente', 'Cerrar');
          this.loadingCompany = false;
        },
        (error) => {
          console.error(error);
          this.snackBarService.openSnackBar('Error al actualizar la compañía', 'Cerrar');
          this.loadingCompany = false;
        }
      );
    } else {
      this.companyService.createCompany(nuevaCompania).subscribe(
        (response) => {
          this.snackBarService.openSnackBar('Compañía creada correctamente', 'Cerrar');
          this.loadingCompany = false;
        },
        (error) => {
          console.error(error);
          this.snackBarService.openSnackBar('Error al crear la compañía', 'Cerrar');
          this.loadingCompany = false;
        }
      );
    }
  }


  // Método para seleccionar y subir el archivo de logo
  onFileSelected(event : any) {

    const file:File = event.target.files.item(0);
    this.selectedFile = file;

    if (file) {

        this.fileName = file.name;

        console.log(this.fileName);
    }
  }
}
