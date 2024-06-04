import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-manager',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, MatButtonModule, RouterModule],
  templateUrl: './products-manager.component.html',
  styleUrl: './products-manager.component.css'
})
export class ProductsManagerComponent {
  insuranceForm!: FormGroup;
  insurancesArray!: FormArray;
  displayedColumns: string[] = ['type', 'actions'];
  insurances: { id: number, type: string }[] = [
    { id: 1, type: 'Seguro 1' },
    { id: 2, type: 'Seguro 2' },
    { id: 3, type: 'Seguro 3' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.insuranceForm = this.fb.group({
      insurances: this.fb.array(this.insurances.map(insurance => this.createInsuranceGroup(insurance)))
    });

    this.insurancesArray = this.insuranceForm.get('insurances') as FormArray;
  }

  createInsuranceGroup(insurance: { id: number, type: string }): FormGroup {
    return this.fb.group({
      id: [insurance.id],
      type: [insurance.type]
    });
  }

  addInsurance() {
    const newInsurance = this.fb.group({
      type: ['Nuevo Seguro']
    });
    this.insurancesArray.push(newInsurance);
  }

  editInsurance(index: number) {
    const insurance = this.insurancesArray.at(index) as FormGroup;
    // Aquí puedes agregar la lógica para editar el seguro, por ejemplo, abrir un modal con el formulario de edición
    console.log(`Editar seguro en el índice ${index}:`, insurance.value);
  }

  deleteInsurance(index: number) {
    this.insurancesArray.removeAt(index);
  }

  onSubmit() {
    console.log(this.insuranceForm.value);
  }
}
