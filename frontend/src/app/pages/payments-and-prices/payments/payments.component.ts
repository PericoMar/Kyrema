import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule , MatButtonModule, ReactiveFormsModule, BrowserAnimationsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  pricesForm: FormGroup;
  insurances = ['Seguro 1', 'Seguro 2', 'Seguro 3']; // Ejemplo de seguros
  paymentTypes = ['Pago 1', 'Pago 2', 'Pago 3']; // Ejemplo de tipos de pago
  displayedColumns: string[];

  constructor(private fb: FormBuilder) {
    this.pricesForm = this.fb.group({
      payments: this.fb.array([])
    });
    this.displayedColumns = ['type', ...this.insurances];
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    const paymentsArray = this.pricesForm.get('payments') as FormArray;
    this.paymentTypes.forEach(type => {
      const paymentGroup : FormGroup = this.fb.group({
        type: [type]
      });
      this.insurances.forEach(insurance => {
        paymentGroup.addControl(insurance, this.fb.control(false));
      });
      paymentsArray.push(paymentGroup);
    });
  }

  get paymentsArray(): FormArray {
    return this.pricesForm.get('payments') as FormArray;
  }

  onSubmit() {
    console.log(this.pricesForm.value);
  }
}
