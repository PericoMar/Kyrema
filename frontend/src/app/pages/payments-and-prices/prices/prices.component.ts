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

interface TarifasPorTipoProducto {
  id: string,
  nombre: string,
  prima_seguro: string,
  cuota_asociacion: string,
  precio_total: string
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
  tiposProducto!: TipoProducto[];
  tarifas! : Tarifa[];
  tarifasPorTipoProducto: TarifasPorTipoProducto[] = [];
  displayedColumns: string[] = ['nombre', 'prima_seguro', 'cuota_asociacion', 'precio_total'];
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
        console.log(this.tiposProducto)
      },
      error => {
        console.error('Error cogiendo los tipos de producto por sociedad', error);
      }
    );
    this.ratesService.getTarifasPorSociedad(this.sociedad_id).subscribe(
      data => {
        this.tarifas = data;
        console.log(this.tarifas)
        this.tarifasPorTipoProducto = this.combineArrays(this.tiposProducto, this.tarifas);
        console.log(this.tarifasPorTipoProducto)
      },
      error => {
        console.error('Error cogiendo las tarifas por sociedad', error);
    });

  }

  combineArrays(tiposProductos: TipoProducto[], tarifas: Tarifa[]): any {
    return tarifas.map(tarifa => {
      const tipoProducto = tiposProductos.find(t => t.id === tarifa.tipo_producto_id) || {} as TipoProducto;
      return { id: tipoProducto.id, nombre: tipoProducto.nombre, prima_seguro: tarifa.prima_seguro, cuota_asociacion: tarifa.cuota_asociacion, precio_total: tarifa.precio_total };
    });
  }

  onSubmit() {
    console.log(this.tarifasPorTipoProducto);
  }
}
