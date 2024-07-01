import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { SocietyService } from '../../services/society.service';

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './commissions.component.html',
  styleUrl: './commissions.component.css'
})
export class CommissionsComponent {
  comisionesForm!: FormGroup;
  comisionesArray!: FormArray;
  displayedColumns: string[] = ['type', 'fixedFee', 'percentageFee', 'totalPrice'];
  
  comisiones: { type: string }[] = [
    { type: 'Comisión 1' },
    { type: 'Comisión 2' },
    { type: 'Comisión 3' },
  ];
  
  defaultPrices: { fixedFee: number, percentageFee: number, totalPrice: number }[] = [
    { fixedFee: 100, percentageFee: 0, totalPrice: 150 },
    { fixedFee: 120, percentageFee: 0, totalPrice: 180 },
    { fixedFee: 90, percentageFee: 0, totalPrice: 135 },
  ];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private sociedadService: SocietyService) {}

  ngOnInit() {
    const sociedad = this.sociedadService.getSociedadPorRuta();
    // Puedes usar la sociedad para filtrar o modificar los datos aquí.

    this.comisionesForm = this.fb.group({
      comisiones: this.fb.array(this.comisiones.map((comision, index) => this.createComisionGroup(comision, index)))
    });

    this.comisionesArray = this.comisionesForm.get('comisiones') as FormArray;
  }

  createComisionGroup(comision: { type: string }, index: number): FormGroup {
    const defaultPrice = this.defaultPrices[index];
    return this.fb.group({
      type: [comision.type],
      fixedFee: [defaultPrice.fixedFee, [this.fixedOrPercentageValidator('percentageFee')]],
      percentageFee: [defaultPrice.percentageFee, [this.fixedOrPercentageValidator('fixedFee')]],
      totalPrice: [{value: defaultPrice.totalPrice, disabled: true}] // Campo deshabilitado
    });
  }

  fixedOrPercentageValidator(otherControlName: string) {
    return (control: any) => {
      if (!control.parent) {
        return null;
      }
      const otherControl = control.parent.get(otherControlName);
      if (control.value && otherControl?.value) {
        return { bothFilled: true };
      }
      return null;
    };
  }

  onSubmit() {
    if (this.comisionesForm.valid) {
      console.log(this.comisionesForm.value);
      // Procesa los datos del formulario aquí
    } else {
      console.log("El formulario no es válido");
    }
  }
}
