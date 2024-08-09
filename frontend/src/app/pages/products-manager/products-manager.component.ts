import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FamilyProductService } from '../../services/family-product.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ErrorDialogComponent } from '../../components/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProductDialogComponent } from '../../components/delete-product-dialog/delete-product-dialog.component';

@Component({
  selector: 'app-products-manager',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, MatButtonModule, RouterModule, SpinnerComponent, ErrorDialogComponent],
  templateUrl: './products-manager.component.html',
  styleUrl: './products-manager.component.css'
})
export class ProductsManagerComponent {
  insuranceForm!: FormGroup;
  insurancesArray!: FormArray;
  displayedColumns: string[] = ['type', 'actions'];
  insurances!: { id: number, type: string }[];

  constructor(private fb: FormBuilder,
              private familyService: FamilyProductService,
              private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getTiposProductos();    
  }

  createInsuranceGroup(insurance: { id: number, type: string }): FormGroup {
    return this.fb.group({
      id: [insurance.id],
      type: [insurance.type]
    });
  }


  editInsurance(index: number) {
    const insurance = this.insurancesArray.at(index) as FormGroup;
    // Aquí puedes agregar la lógica para editar el seguro, por ejemplo, abrir un modal con el formulario de edición
    console.log(`Editar seguro en el índice ${index}:`, insurance.value);
  }

  

  getTiposProductos(){
    this.familyService.getAllTipos().subscribe(
      (tipos) => {
        // Pasar los tipos al siguiente formato:
        // { id: 1, type: 'Seguro 1' }, donde type es el nombre.
        this.insurances = tipos.map((tipo: any) => ({ id: tipo.id, type: tipo.nombre }));
        this.insuranceForm = this.fb.group({
          insurances: this.fb.array(this.insurances.map(insurance => this.createInsuranceGroup(insurance)))
        });
    
        this.insurancesArray = this.insuranceForm.get('insurances') as FormArray;
      },
      (error) => {
        console.log(error);
      });
  }

  deleteInsurance(data: any) {
    this.dialog.open(DeleteProductDialogComponent, {
      width: '400px',
      data : {
        id: data.id,
        message: '¿Estás seguro que deseas eliminar el siguiente tipo de producto?',
        nombre: data.nombre
      },
    });
  }
}
