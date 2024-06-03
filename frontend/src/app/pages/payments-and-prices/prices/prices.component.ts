import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSuffix } from '@angular/material/form-field';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatTableModule, MatFormFieldModule, ReactiveFormsModule, MatSuffix, MatInputModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css'
})
export class PricesComponent {
  insurancePricesForm!: FormGroup;
  insurancesArray!: FormArray;
  displayedColumns: string[] = ['type', 'premium', 'associationFee', 'totalPrice'];
  insurances: { type: string }[] = [
    { type: 'Seguro 1' },
    { type: 'Seguro 2' },
    { type: 'Seguro 3' },
  ];
  defaultPrices: { premium: number, associationFee: number, totalPrice: number }[] = [
    { premium: 100, associationFee: 50, totalPrice: 150 },
    { premium: 120, associationFee: 60, totalPrice: 180 },
    { premium: 90, associationFee: 45, totalPrice: 135 },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.insurancePricesForm = this.fb.group({
      insurances: this.fb.array(this.insurances.map((insurance, index) => this.createInsuranceGroup(insurance, index)))
    });

    this.insurancesArray = this.insurancePricesForm.get('insurances') as FormArray;
  }

  createInsuranceGroup(insurance: { type: string }, index: number): FormGroup {
    const defaultPrice = this.defaultPrices[index];
    return this.fb.group({
      type: [insurance.type],
      premium: [defaultPrice.premium],
      associationFee: [defaultPrice.associationFee],
      totalPrice: [defaultPrice.totalPrice]
    });
  }

  onSubmit() {
    console.log(this.insurancePricesForm.value);
  }
}
