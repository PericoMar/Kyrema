import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { RatesService } from '../../../services/rates.service';
import { forkJoin } from 'rxjs';
import { FamilyProductService } from '../../../services/family-product.service';
import { SnackBarService } from '../../../services/snackBar/snack-bar.service';
import { ButtonSpinnerComponent } from '../../../components/button-spinner/button-spinner.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule , MatButtonModule, ReactiveFormsModule, CommonModule, ButtonSpinnerComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  
  pricesForm: FormGroup;
  paymentTypes! : any[];
  insurances! : any[]; // Seguros como filas
  displayedColumns!: string[];
  @Input() sociedad_id!: string;

  cargandoGuardado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ratesService: RatesService,
    private familyService: FamilyProductService,
    private snackBarService: SnackBarService
  ) {
    this.pricesForm = this.fb.group({
      insurances: this.fb.array([]) // Cambiado de payments a insurances
    });
  }

  ngOnInit() {
    forkJoin({
      paymentTypes: this.ratesService.getAllPaymentTypes(),
      insurances: this.familyService.getTiposProductoPorSociedad(this.sociedad_id),
      tipoPagoProductoSociedades: this.ratesService.getTipoPagoProductoSociedades(this.sociedad_id)
    }).subscribe(({ paymentTypes, insurances, tipoPagoProductoSociedades }) => {
      this.paymentTypes = paymentTypes; // Mantiene tanto el id como el nombre de cada tipo de pago
      this.insurances = insurances;
      this.displayedColumns = ['insurance', ...this.paymentTypes.map(pt => pt.nombre)];
      this.initializeForm(tipoPagoProductoSociedades); // Pasa los datos adicionales a la inicialización del formulario
    });
  }
  
  

  initializeForm(tipoPagoProductoSociedades: any[]) {
    const insurancesArray = this.pricesForm.get('insurances') as FormArray;
  
    console.log('Tipo de pago producto sociedades:', tipoPagoProductoSociedades);
    console.log('Insurances:', this.insurances);
    console.log('Payment Types:', this.paymentTypes);
  
    this.insurances.forEach(insurance => {
      const insuranceGroup: FormGroup = this.fb.group({
        id: [insurance.id],
        nombre: [insurance.nombre]
      });
  
      this.paymentTypes.forEach(paymentType => {
        console.log('Tipo de pago:', paymentType.id);
        console.log('Seguro:', insurance.id);
        const isChecked = tipoPagoProductoSociedades.some(tp => 
          tp.tipo_producto_id == insurance.id && tp.tipo_pago_id == paymentType.id
        );
  
        console.log(`Tipo de pago ${paymentType.nombre} para seguro ${insurance.nombre} está marcado: ${isChecked}`);
  
        insuranceGroup.addControl(paymentType.nombre, this.fb.control(isChecked));
      });
  
      insurancesArray.push(insuranceGroup);
    });
  }
  


  get insurancesArray(): FormArray {
    return this.pricesForm.get('insurances') as FormArray;
  }

  onSubmit() {
    this.cargandoGuardado = true;
    const formValue = this.pricesForm.value;
  
    // Aquí asumimos que `sociedad_id` es una propiedad de tu componente o recibida desde algún otro lugar
    const sociedad_id = this.sociedad_id;
  
    // Construir el array para enviar al backend
    const payload = {
      sociedad_id: sociedad_id,
      tipo_pago_producto_sociedades: formValue.insurances.flatMap((insurance: any) => {
        return this.paymentTypes.map(paymentType => {
          // Si el checkbox está marcado, lo incluimos en el payload
          if (insurance[paymentType.nombre]) {
            return {
              tipo_pago_id: this.paymentTypes.find(pt => pt.nombre === paymentType.nombre)?.id,
              tipo_producto_id: insurance.id // Usa el id del seguro
            };
          }
          return null;
        }).filter(item => item !== null);
      })
    };
  
    console.log('Datos a enviar al backend', payload);
  
    this.ratesService.saveTipoPagoProductoSociedades(payload).subscribe(
      response => {
        this.cargandoGuardado = false;
        this.snackBarService.openSnackBar('Datos guardados correctamente', 'Cerrar');
      },
      error => {
        this.cargandoGuardado = false;
        this.snackBarService.openSnackBar('Error al guardar los datos', 'Cerrar');
      }
    );
  }
  
  
}
