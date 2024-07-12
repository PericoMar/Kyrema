import { Component } from '@angular/core';
import { TableComponent } from './table/table.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ActivatedRoute } from '@angular/router';
import { FamilyProductService } from '../../services/family-product.service';
import { CamposService } from '../../services/campos.service';
import { ColDef} from 'ag-grid-community'; 
import { ProductsService } from '../../services/products.service';
import { SocietyService } from '../../services/society.service';

@Component({
  selector: 'app-product-operations',
  standalone: true,
  imports: [TableComponent, ProductFormComponent],
  templateUrl: './product-operations.component.html',
  styleUrl: './product-operations.component.css'
})
export class ProductOperationsComponent {
  productName! : string;
  productUrl! : string;
  columnDefs! : ColDef[];
  rowData! : any[] | null;
  products! : Array<any>;
  productSelected : any = {
    make: "",
      model: "",
      price: "",
      electric: true,
      month: "",
  };
  isProductSelected : boolean = false;
  familyProduct! : any;
  sociedadesBusqueda! : any[];
  idsSociedades! : any[];
  camposFormulario: any;

  

  constructor(
    private route: ActivatedRoute,
    private familyService : FamilyProductService,
    private camposService : CamposService,
    private productsService : ProductsService,
    private societyService : SocietyService
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
  }

  public onProductSelectedChanged(product: any) {
    this.isProductSelected = true;

    // Añadir el campo id a productSelected y actualizar sus valores
    this.productSelected = { id: product.id, ...this.camposFormulario };

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
    console.log(`Producto cargado: ${productUrl}`);
    this.familyService.getTipoProductoPorLetras(productUrl).subscribe(
      (data : any) => {
        this.familyProduct = data;
        this.productName = this.familyProduct.nombre;
        console.log("Data",this.familyProduct);
        this.camposService.getCamposVisiblesPorTipoProducto(this.familyProduct.id).subscribe(
          data => {
            console.log(data);
            this.columnDefs = data.map((campo : any) => {
              return { headerName: campo.nombre, field: campo.nombre.replace(/\s/g, '_').toLowerCase() };
            });
          },
          error => {
            console.log(error); 
          }
        )

        //Recoger todos los valores de la tabla
        this.productsService.getProductosByTipoAndSociedades(this.familyProduct.letras_identificacion, this.idsSociedades).subscribe(
          data => {
            console.log(data);
            this.rowData = data;
          },
          error => {
            console.log(error); 
          }
        )

        //Recoger los campos del formulario
        this.camposService.getCamposFormularioPorTipoProducto(this.familyProduct.id).subscribe(
          (productSelected:any) => {

            const resultObject : any = {};

            // Procesar cada objeto en el array
            productSelected.forEach((item : any) => {
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

            this.camposFormulario = resultObject;
            this.productSelected = resultObject;

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

}
