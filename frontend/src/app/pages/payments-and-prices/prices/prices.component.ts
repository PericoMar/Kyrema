import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSuffix } from '@angular/material/form-field';
import { TipoProducto } from '../../../interfaces/tipo-producto';
import { FamilyProductService } from '../../../services/family-product.service';
import { RatesService } from '../../../services/rates.service';
import { Tarifa } from '../../../interfaces/tarifa';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

interface CombinedData {
  tipoProducto: TipoProducto;
  tarifa: Tarifa;
}

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatTableModule, MatFormFieldModule, ReactiveFormsModule, MatSuffix, MatInputModule , SpinnerComponent, CommonModule, CdkTableModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css'
})
export class PricesComponent {
  @Input() infoClass : string = "info-message";
  @Input() infoText : string = "Nota: Los precios que establezca en este formulario se aplicarán únicamente a la sociedad seleccionada.";
  tarifasForm!: FormGroup;
  tiposProducto!: TipoProducto[];
  tarifas! : Tarifa[];
  combinedData: CombinedData[] = [];
  displayedColumns: string[] = ['tipoProducto', 'prima_seguro', 'cuota_asociacion', 'precio_total'];
  @Input() sociedad_id!: string;


  constructor(
    private fb: FormBuilder,
    private familyService: FamilyProductService,
    private ratesService : RatesService
  ) {}

  ngOnInit() {
    this.familyService.getTiposProductoPorSociedad(this.sociedad_id).subscribe(
      data => {
        this.tiposProducto = data;
        console.log(this.tiposProducto);
      },
      error => {
        console.error('Error cogiendo los tipos de producto por sociedad', error);
      }
    );
    this.ratesService.getTarifasPorSociedad(this.sociedad_id).subscribe(
      data => {
        this.tarifas = data;
        console.log(this.tarifas);
        this.combinedData = this.combineArrays(this.tiposProducto, this.tarifas);
        this.tarifasForm = this.fb.group({
          tarifas: this.fb.array(this.combinedData.map(data => this.createTarifaGroup(data)))
        });
      },
      error => {
        console.error('Error cogiendo las tarifas por sociedad', error);
    });

  }

  combineArrays(tipoProductos: TipoProducto[], tarifas: Tarifa[]): CombinedData[] {
    return tipoProductos.map(tipoProducto => {
      const tarifa = tarifas.find(t => t.tipo_producto_id === tipoProducto.letras_identificacion) || {} as Tarifa;
      return { tipoProducto, tarifa };
    });
  }

  createTarifaGroup(data: CombinedData): FormGroup {
    return this.fb.group({
      tipo_producto_id: [data.tipoProducto.letras_identificacion],
      prima_seguro: [data.tarifa.prima_seguro || ''],
      cuota_asociacion: [data.tarifa.cuota_asociacion || ''],
      precio_total: [data.tarifa.precio_total || '']
    });
  }

  get tarifasFormArray() {
    return this.tarifasForm.get('tarifas') as FormArray;
  }

  onSubmit() {
    console.log(this.tarifasForm.value.tarifas);
  }
}
