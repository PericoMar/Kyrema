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
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../../components/error-dialog/error-dialog.component';

interface TarifasPorTipoProducto {
  id: string,
  nombre: string,
  prima_seguro: string,
  cuota_asociacion: string,
  precio_total: string,
  tarifa_sociedad: string
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
    private ratesService : RatesService,
    public dialog: MatDialog,
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
    return tarifas
        .filter(tarifa => tiposProductos.some(t => t.id === tarifa.tipo_producto_id))  // Filtrar las tarifas que tienen un tipoProducto correspondiente
        .map(tarifa => {
            const tipoProducto = tiposProductos.find(t => t.id === tarifa.tipo_producto_id) as TipoProducto;
            return {
                id: tipoProducto.id,
                nombre: tipoProducto.nombre,
                prima_seguro: tarifa.prima_seguro,
                cuota_asociacion: tarifa.cuota_asociacion,
                precio_total: tarifa.precio_total,
                tarifa_sociedad: tarifa.id_sociedad
            };
        });
}
  onSubmit() {
    if(this.todosLosPreciosFormatoCorrecto()) {

      console.log(this.tarifasPorTipoProducto);

      this.tarifasPorTipoProducto.forEach(tarifa => {
        console.log(tarifa);
        if(tarifa.tarifa_sociedad != this.sociedad_id){
          //Nuevos campos
          this.ratesService.createTarifaPorSociedad(this.sociedad_id, tarifa).subscribe(
            data => {
              console.log('Tarifa creada correctamente');
            },
            error => {
              console.error('Error creando tarifa', error);
            }
          );
        } else {
          //Actualizar campos
          this.ratesService.updateTarifasPorSociedad(this.sociedad_id, tarifa).subscribe(
            data => {
              console.log('Tarifa actualizada correctamente');
            },
            error => {
              console.error('Error actualizando tarifa', error);
            }
          );
        }
      });

    } else {
      this.showErrorDialog('Formato de precios incorrecto. Por favor, asegúrese de que todos los precios son números.');
    }
    
  }

  private todosLosPreciosFormatoCorrecto(): boolean {
    //Hay que comprobar que todos sean numeros: prima_seguro, cuota_asociacion, precio_total
    return this.tarifasPorTipoProducto.every(tarifa => {
      return !isNaN(Number(tarifa.prima_seguro)) && !isNaN(Number(tarifa.cuota_asociacion)) && !isNaN(Number(tarifa.precio_total));
    });
  }

  tarifasPorTipoProductoVacio(): boolean {
    //Tengo que comrpobar que ni id ni nombre ni precio total estén vacios:
    return this.tarifasPorTipoProducto.every(tarifa => {
      return tarifa.id === '' || tarifa.nombre === '' || tarifa.precio_total === '';
    });
  }

  showErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '300px',
      data: { message }
    });
  }
}
