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
import { SnackBarService } from '../../../services/snackBar/snack-bar.service';
import { forkJoin } from 'rxjs';
import { ButtonSpinnerComponent } from '../../../components/button-spinner/button-spinner.component';

interface TarifasPorTipoProducto {
  id: string,
  nombre: string,
  precio_base: string;
  extra_1: string;
  extra_2: string;
  extra_3: string;
  precio_total: string;
  tarifa_sociedad: string
}

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatTableModule, MatFormFieldModule, ReactiveFormsModule, MatSuffix, MatInputModule , SpinnerComponent, CommonModule, CdkTableModule, ButtonSpinnerComponent],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css'
})
export class PricesComponent {
  @Input() infoClass : string = "info-message";
  @Input() infoText : string = "Nota: Los precios que establezca en este formulario se aplicarán únicamente a la sociedad seleccionada.";
  tiposProducto!: TipoProducto[];
  tarifas! : Tarifa[];
  tarifasPorTipoProducto: TarifasPorTipoProducto[] = [];
  displayedColumns: string[] = ['nombre', 'precio_base', 'extra_1','extra_2','extra_3', 'precio_total'];
  @Input() sociedad_id!: string;
  loadingTarifas: boolean = false;


  constructor(
    private fb: FormBuilder,
    private familyService: FamilyProductService,
    private ratesService : RatesService,
    public dialog: MatDialog,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit() {
    this.familyService.getTiposProductoPorSociedad(this.sociedad_id).subscribe(
      data => {
        this.tiposProducto = data;
        console.log(this.tiposProducto)
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
      },
      error => {
        console.error('Error cogiendo los tipos de producto por sociedad', error);
      }
    );
    

  }

  combineArrays(tiposProductos: TipoProducto[], tarifas: Tarifa[]): any {
    return tarifas
        .filter(tarifa => tiposProductos.some(t => t.id === tarifa.tipo_producto_id))  // Filtrar las tarifas que tienen un tipoProducto correspondiente
        .map(tarifa => {
            const tipoProducto = tiposProductos.find(t => t.id === tarifa.tipo_producto_id) as TipoProducto;
            return {
                id: tipoProducto.id,
                nombre: tipoProducto.nombre,
                precio_base: tarifa.precio_base,
                extra_1: tarifa.extra_1,
                extra_2: tarifa.extra_2,
                extra_3: tarifa.extra_3,
                precio_total: tarifa.precio_total,
                tarifa_sociedad: tarifa.id_sociedad
            };
        });
  }

  onSubmit() {
    this.loadingTarifas = true;
    
    // Reemplazar comas por puntos en los precios
    this.tarifasPorTipoProducto.forEach(tarifa => {
      tarifa.precio_base = tarifa.precio_base ? tarifa.precio_base.replace(',', '.') : '0';
      tarifa.extra_1 = tarifa.extra_1 ? tarifa.extra_1.replace(',', '.') : '0';
      tarifa.extra_2 = tarifa.extra_2 ? tarifa.extra_2.replace(',', '.') : '0';
      tarifa.extra_3 = tarifa.extra_3 ? tarifa.extra_3.replace(',', '.') : '0';
      tarifa.precio_total = tarifa.precio_total.replace(',', '.');
    });
  
    if (this.todosLosPreciosFormatoCorrecto()) {
      const requests = this.tarifasPorTipoProducto.map(tarifa => {
        if (tarifa.tarifa_sociedad !== this.sociedad_id) {
          // Crear nueva tarifa
          return this.ratesService.createTarifaPorSociedad(this.sociedad_id, tarifa);
        } else {
          // Actualizar tarifa existente
          return this.ratesService.updateTarifaPorSociedad(this.sociedad_id, tarifa);
        }
      });
  
      // Ejecutar todas las solicitudes
      forkJoin(requests).subscribe(
        () => {
          this.loadingTarifas = false;
          this.snackbarService.openSnackBar('Tarifas guardadas correctamente');
        },
        error => {
          this.loadingTarifas = false;
          console.error('Error al guardar tarifas', error);
          this.showErrorDialog('Hubo un error al guardar las tarifas. Inténtalo de nuevo.');
        }
      );
    } else {
      this.showErrorDialog('Formato de precios incorrecto. Por favor, asegúrese de que todos los precios son números.');
    }
  }

  private todosLosPreciosFormatoCorrecto(): boolean {
    //Hay que comprobar que todos sean numeros: prima_seguro, cuota_asociacion, precio_total
    return this.tarifasPorTipoProducto.every(tarifa => {
      return !isNaN(Number(tarifa.precio_base)) && !isNaN(Number(tarifa.extra_1)) && !isNaN(Number(tarifa.extra_2)) && !isNaN(Number(tarifa.extra_3)) && !isNaN(Number(tarifa.precio_total));
    });
  }

  calculateTotal(tarifaPorTipoProducto: any): void {
    const precioBase = parseFloat(tarifaPorTipoProducto.precio_base) || 0;
    const extra1 = parseFloat(tarifaPorTipoProducto.extra_1) || 0;
    const extra2 = parseFloat(tarifaPorTipoProducto.extra_2) || 0;
    const extra3 = parseFloat(tarifaPorTipoProducto.extra_3) || 0;
  
    // Calcular el precio total sumando precio_base y extras
    tarifaPorTipoProducto.precio_total = (precioBase + extra1 + extra2 + extra3).toFixed(2);
  }
  
  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.charCode;
    // Permitir solo números y comas
    if ((charCode >= 48 && charCode <= 57) || charCode === 44 || charCode === 46) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
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
