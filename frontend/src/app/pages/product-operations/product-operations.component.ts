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
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../services/snackBar/snack-bar.service';
import { UserService } from '../../services/user.service';
import { Commercial } from '../../interfaces/commercial';

@Component({
  selector: 'app-product-operations',
  standalone: true,
  imports: [TableComponent, ProductFormComponent, RouterModule, CommonModule],
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
  tipo_producto! : any;
  sociedadesBusqueda! : any[];
  idsSociedades! : any[];
  camposFormulario: any;
  camposLoaded: boolean = false;
  formLoaded: boolean = false;

  currentPage: number = 1;
  paginationPageSize: number = 10;
  loadingRows!: boolean;

  camposSubproductos: any[] = [];
  comercial!: Commercial;

  

  constructor(
    private route: ActivatedRoute,
    private familyService : FamilyProductService,
    private camposService : CamposService,
    private productsService : ProductsService,
    private societyService : SocietyService,
    private router : Router,
    private productNotificationService: ProductNotificationService,
    private snackBarService: SnackBarService,
    private userService: UserService
  ) {
    
  }

  ngOnInit(): void {
    // Suscríbete a los parámetros de la ruta para obtener el nombre del producto
    this.route.paramMap.subscribe(params => {
      this.comercial = this.userService.getCurrentUser();
      console.log("Comercial", this.comercial);
      this.loadingRows = true;
      this.productUrl = params.get('product')!;
      this.societyService.getSociedadesHijasObservable().subscribe({
        next: (data : any) => {
          try {
            this.sociedadesBusqueda = data;
            this.idsSociedades = this.sociedadesBusqueda.map(sociedad => sociedad.id);
            this.loadProductData(this.productUrl);
            console.log("ids", this.idsSociedades);
          } catch (error) {
            console.log(error);
            // Recargar la pagina
            this.snackBarService.openSnackBar("Error al cargar las sociedades, prueba a recargar la página");
          }
        },
        error: (error : any) => {
          console.log(error);
        }
      });
    });

    this.productNotificationService.productNotification$.subscribe(
      () => {
        if(this.tipo_producto){
          this.comercial.responsable == 1 ? this.loadRowData() : this.loadComercialRowData();
        }
      }
    );
  }

  // onPageChanged(page: number) {
  //   this.currentPage = page;
  //   console.log('Page changed:', page);
  //   // this.loadRowData();
  // }

  public onProductSelectedChanged(product: any) {
    if(!this.formLoaded){
      this.snackBarService.openSnackBar("Por favor, espere a que se carguen los campos del formulario");
    } else {
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
      this.snackBarService.openSnackBar("Producto seleccionado");
      this.limpiarEstilosErrores();
    }
  }

  // Método para cargar los datos del producto
  loadProductData(productUrl: string): void {
    // Aquí puedes implementar la lógica para cargar los datos del producto
    this.familyService.getTipoProductoPorLetras(productUrl).subscribe(
      (data : any) => {
        this.tipo_producto = data;
        this.productName = this.tipo_producto.nombre;
        if(data.subproductos && data.subproductos.length > 0){
          this.getAllCamposSubproductos(data.subproductos);
        }
        console.log("Data",this.tipo_producto);
        this.camposService.getCamposVisiblesPorTipoProducto(this.tipo_producto.id).subscribe(
          data => {
            this.columnDefs = data.map((campo : any) => {
              return { headerName: campo.nombre, field: campo.nombre_codigo ? campo.nombre_codigo : campo.nombre.toLowerCase().replace(/ /g, "_") };
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

        this.comercial.responsable == 1 ? this.loadRowData() : this.loadComercialRowData();
        

        //Recoger los campos del formulario
        this.camposService.getCamposPorTipoProducto(this.tipo_producto.id).subscribe(
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
              switch (item.tipo_producto) {
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
            console.log("Producto generado cuando cambiamos de tipo de producto", this.productSelected);
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
    this.productsService.getProductosByTipoAndSociedadesNoAnulados(this.tipo_producto.letras_identificacion, this.idsSociedades).subscribe(
      data => {
        this.rowData = data;
        this.loadingRows = false;
      },
      error => {
        console.log(error); 
      }
    );

  }

  loadComercialRowData() {
    //Recoger todos los valores de la tabla
    this.productsService.getProductosByTipoAndComercialNoAnulados(this.tipo_producto.letras_identificacion, this.comercial.id).subscribe(
      data => {
        this.rowData = data;
        this.loadingRows = false;
      },
      error => {
        console.log(error); 
      }
    );
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

  handleFormLoadedChange(isLoaded: boolean) {
    console.log('Form is loaded:', isLoaded);
    this.formLoaded = isLoaded;
    // Aquí puedes manejar lo que sucede cuando el formulario está cargado
  }

  getAllCamposSubproductos(subproductos : any){
    subproductos.forEach((subproducto : any) => {
      subproducto.campos.forEach((campo : any) => {
        if(campo.grupo === "datos_producto"){
          this.camposSubproductos.push(campo);
        }
      });
    });
    console.log("Campos subproductos", this.camposSubproductos);
  }

  limpiarEstilosErrores() {
    // Quitar la clase de error de todos los campos
    const campos = document.querySelectorAll('input');
    campos.forEach((campo: HTMLInputElement) => {
      campo.classList.remove('input-error');
    });
  }

}
