import { Component } from '@angular/core';
import { TableComponent } from './table/table.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ActivatedRoute } from '@angular/router';
import { FamilyProductService } from '../../services/family-product.service';
import { CamposService } from '../../services/campos.service';
import { ColDef} from 'ag-grid-community'; 

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
  

  constructor(
    private route: ActivatedRoute,
    private familyService : FamilyProductService,
    private camposService : CamposService
  ) {
  }

  ngOnInit(): void {
    // Suscríbete a los parámetros de la ruta para obtener el nombre del producto
    this.route.paramMap.subscribe(params => {
      this.productUrl = params.get('product')!;
      this.loadProductData(this.productUrl);
    });
  }

  public onProductSelectedChanged(product: any) {
    this.productSelected = product;
    this.isProductSelected = true;
  }

  // Método para cargar los datos del producto
  loadProductData(productUrl: string): void {
    // Aquí puedes implementar la lógica para cargar los datos del producto
    console.log(`Producto cargado: ${productUrl}`);
    this.familyService.getTipoProductoPorId(productUrl).subscribe(
      data => {
        this.familyProduct = data;
        this.productName = this.familyProduct.nombre;
        console.log("Data",this.familyProduct);
      },
      error => {
        console.log(error);
      }
    )
    this.camposService.getCamposVisiblesPorTipoProducto(productUrl).subscribe(
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
  }

}
