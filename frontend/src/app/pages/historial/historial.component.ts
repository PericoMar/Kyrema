import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CanceledService } from '../../services/canceled.service';
import { FamilyProductService } from '../../services/family-product.service';
import { SocietyService } from '../../services/society.service';
import { TableComponent } from '../product-operations/table/table.component';
import { ColDef, GridOptions} from 'ag-grid-community'; 
import { ActionButtonsComponent } from '../society-manager/society-table/action-buttons/action-buttons.component';
import { ComisionButtonsComponent } from '../society-manager/society-table/comision-buttons/comision-buttons.component';
import { ProductActionButtonsComponent } from '../../components/product-action-buttons/product-action-buttons.component';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent  {
  productUrl! : string;
  tipoProducto! : any;
  tipoProductoNombre! : string;
  rowData! : any[] | null;
  // return {
  //   causa: this.causa,
  //   comercial_id: this.comercial.id,
  //   sociedad_id: this.sociedad.id,
  //   comercial_nombre: this.comercial.nombre,
  //   sociedad_nombre: this.sociedad.nombre,
  //   codigo_producto: this.data.codigo_producto,
  //   id: this.data.id
  // }
  columnDefs : ColDef[] = [
    { headerName: 'Código', field: 'codigo_producto', sortable: true, filter: true, flex:1 },
    { headerName: 'Fecha de fin', field: 'fecha_de_fin', sortable: true, filter: true, flex:1 },
    { headerName: 'Comercial', field: 'comercial', sortable: true, filter: true, flex:1 },
    { headerName: 'Sociedad', field: 'sociedad', sortable: true, filter: true, flex:1 },
    { headerName: 'Número de anexos', field: 'numero_anexos', sortable: true, filter: true,flex:1 },
    {
      headerName: 'Acciones',
      cellRenderer: this.getCellRenderer('/historial'), 
      cellRendererParams: (params: any) => ({
        data: params.data
      }),
      suppressHeaderMenuButton: true,
      sortable: false,
      filter: false,
    } 
  ];
  idsSociedades!: any[];
  gridOptions!: GridOptions;

  constructor(private route : ActivatedRoute,
    private familyService: FamilyProductService,
    private productsService : ProductsService,
    private societyService : SocietyService
  ) { 
    this.idsSociedades = this.societyService.getSociedadesHijas().map((sociedad:any) => sociedad.id);
  }

  ngOnInit(): void {
    // Suscríbete a los parámetros de la ruta para obtener el nombre del producto
    this.route.paramMap.subscribe(params => {
      this.productUrl = params.get('product')!;
      
    });
    this.loadHistorial();
  
  }

  loadHistorial(){
    this.familyService.getTipoProductoPorLetras(this.productUrl).subscribe(
      (tipoProducto: any) => {
        this.tipoProducto = tipoProducto;
        this.tipoProductoNombre = tipoProducto.nombre;
        
        this.productsService.getHistorialProductosByTipoAndSociedades(this.productUrl, this.idsSociedades).subscribe(
          (productos: any) => {
            this.rowData = productos;

            this.gridOptions = {
              getRowClass: params => {
                // return params.data.fecha_de_fin < today ? 'seguro-no-vigente' : ''; // Asigna una clase CSS si el producto está anulado
                return params.data.anulado == '0' ? 'seguro-no-vigente' : 'seguro-no-vigente'; // Asigna una clase CSS si el producto está anulado
              }
            };

            console.log('gridOptions changed:', this.gridOptions);
          }
        );
      }
    );
  }

  getCellRenderer(route: string) {
    if (route.includes('/sociedades')) {
      return ActionButtonsComponent;
    } else if (route.includes('/comisiones')) {
      return ComisionButtonsComponent;
    } else if(route.includes('/operaciones') || route.includes('/historial')){
      return ProductActionButtonsComponent;
    }
    return null; // o cualquier valor por defecto
  }

}
