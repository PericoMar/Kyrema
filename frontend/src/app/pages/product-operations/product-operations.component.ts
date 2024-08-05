import { Component } from '@angular/core';
import { TableComponent } from './table/table.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FamilyProductService } from '../../services/family-product.service';
import { CamposService } from '../../services/campos.service';
import { ColDef} from 'ag-grid-community'; 
import { ProductsService } from '../../services/products.service';
import { SocietyService } from '../../services/society.service';
import { ActionButtonsComponent } from '../society-manager/society-table/action-buttons/action-buttons.component';
import { ComisionButtonsComponent } from '../society-manager/society-table/comision-buttons/comision-buttons.component';
import { ProductActionButtonsComponent } from '../../components/product-action-buttons/product-action-buttons.component';
import { ProductNotificationService } from '../../services/product-notification.service';

@Component({
  selector: 'app-product-operations',
  standalone: true,
  imports: [TableComponent, ProductFormComponent, RouterModule],
  templateUrl: './product-operations.component.html',
  styleUrl: './product-operations.component.css'
})
export class ProductOperationsComponent {
  productName! : string;
  productUrl! : string;
  columnDefs! : ColDef[];
  rowData! : any[] | null;
  productSelected! : any;
  isProductSelected : boolean = false;
  familyProduct! : any;
  sociedadesBusqueda! : any[];
  idsSociedades! : any[];
  camposFormulario: any;
  camposLoaded: boolean = false;

  

  constructor(
    private route: ActivatedRoute,
    private familyService : FamilyProductService,
    private camposService : CamposService,
    private productsService : ProductsService,
    private societyService : SocietyService,
    private router : Router,
    private productNotificationService: ProductNotificationService
  ) {
    this.sociedadesBusqueda = this.societyService.getSociedadesHijas();
    this.idsSociedades = this.sociedadesBusqueda.map(sociedad => sociedad.id);
    console.log("ids", this.idsSociedades)
  }

  ngOnInit(): void {
    // Suscríbete a los parámetros de la ruta para obtener el nombre del producto
    this.route.paramMap.subscribe(params => {
      this.productUrl = params.get('product')!;
      this.loadProductData(this.productUrl);
    });

    this.productNotificationService.productNotification$.subscribe(
      () => {
        this.loadRowData();
      }
    );
  }

  public onProductSelectedChanged(product: any) {
    this.isProductSelected = true;
    

    // Añadir el campo id a productSelected y actualizar sus valores
    this.productSelected = { ...product };

    console.log("Producto seleccionado", this.productSelected);

    // Actualizar los valores de productSelected con los del producto seleccionado
    for (const key in this.camposFormulario) {
      if (this.camposFormulario.hasOwnProperty(key) && product.hasOwnProperty(key)) {
        this.productSelected[key] = product[key];
      }
    }
  }

  // Método para cargar los datos del producto
  loadProductData(productUrl: string): void {
    // Aquí puedes implementar la lógica para cargar los datos del producto
    this.familyService.getTipoProductoPorLetras(productUrl).subscribe(
      (data : any) => {
        this.familyProduct = data;
        this.productName = this.familyProduct.nombre;
        console.log("Data",this.familyProduct);
        this.camposService.getCamposVisiblesPorTipoProducto(this.familyProduct.id).subscribe(
          data => {
            this.columnDefs = data.map((campo : any) => {
              return { headerName: campo.nombre, field: campo.nombre.replace(/\s/g, '_').toLowerCase() };
            });
            // Agrega la columna 'Acciones'
            this.columnDefs.push({
              headerName: 'Acciones',
              cellRenderer: this.getCellRenderer(this.router.url),
              cellRendererParams: (params: any) => ({
                data: params.data
              }),
              suppressHeaderMenuButton: true,
              sortable: false,
              filter: false,
            });
          },
          error => {
            console.log(error); 
          }
        )

        this.loadRowData();

        //Recoger los campos del formulario
        this.camposService.getCamposPorTipoProducto(this.familyProduct.id).subscribe(
          (camposFormulario:any) => {

            const resultObject : any = {
              id: "",
              sociedad_id: "",
            };

            // Procesar cada objeto en el array
            camposFormulario.forEach((item : any) => {
              const key = item.nombre.toLowerCase().replace(/ /g, "_");

              // Asignar valor según el tipo de dato
              let value;
              switch (item.tipo_dato) {
                  case "texto":
                  case "numero":
                      value = "";
                      break;
                  case "booleano":
                      value = false;
                      break;
                  case "fecha":
                      value = new Date();
                      break;
                  default:
                      value = "";
              }
          
              // Asignar el valor al nuevo objeto usando la clave dinámica
              resultObject[key] = value;
            });
            this.camposFormulario = camposFormulario;
            this.productSelected = resultObject;
            this.camposLoaded = true;

          },
          (error: any) => {
            console.log(error);
        })
        
      //Control de errores de getTipoProductoPorLetras
      },
      error => {
        console.log(error);
      }
    );   
  }

  loadRowData() {
    //Recoger todos los valores de la tabla
    this.productsService.getProductosByTipoAndSociedadesNoAnulados(this.familyProduct.letras_identificacion, this.idsSociedades).subscribe(
      data => {
        this.rowData = data;
      },
      error => {
        console.log(error); 
      }
    )
  }

  getCellRenderer(route: string) {
    if (route.includes('/sociedades')) {
      return ActionButtonsComponent;
    } else if (route.includes('/comisiones')) {
      return ComisionButtonsComponent;
    } else if(route.includes('/operaciones')){
      return ProductActionButtonsComponent;
    }
    return null; // o cualquier valor por defecto
  }

}
