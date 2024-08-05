import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FamilyProductService } from '../../services/family-product.service';
import { ProductsService } from '../../services/products.service';
import { TableComponent } from '../product-operations/table/table.component';
import { ColDef} from 'ag-grid-community'; 
import { SocietyService } from '../../services/society.service';
import { CanceledService } from '../../services/canceled.service';

@Component({
  selector: 'app-anulaciones-page',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './anulaciones-page.component.html',
  styleUrl: './anulaciones-page.component.css'
})
export class AnulacionesPageComponent {

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
    { headerName: 'Causa', field: 'causa', sortable: true, filter: true, flex:1 },
    { headerName: 'Comercial', field: 'comercial_nombre', sortable: true, filter: true, flex:1 },
    { headerName: 'Sociedad', field: 'sociedad_nombre', sortable: true, filter: true, flex:1 },
    { headerName: 'Fecha de Anulación', field: 'fecha', sortable: true, filter: true,flex:1 },
  ];
  idsSociedades!: any[];

  constructor(private route : ActivatedRoute,
    private familyService: FamilyProductService,
    private canceledService : CanceledService,
    private societyService : SocietyService
  ) { 
    this.idsSociedades = this.societyService.getSociedadesHijas().map((sociedad:any) => sociedad.id);
  }

  ngOnInit(): void {
    // Suscríbete a los parámetros de la ruta para obtener el nombre del producto
    this.route.paramMap.subscribe(params => {
      this.productUrl = params.get('product')!;
      
    });
    this.loadAnuladosData();
  
  }

  loadAnuladosData(){
    this.familyService.getTipoProductoPorLetras(this.productUrl).subscribe(
      (tipoProducto: any) => {
        this.tipoProducto = tipoProducto;
        this.tipoProductoNombre = tipoProducto.nombre;
        
        this.canceledService.getAnuladosByTipoAndSociedades(this.productUrl, this.idsSociedades).subscribe(
          (productos: any) => {
            this.rowData = productos;
          }
        );
      }
    );
  }
}
