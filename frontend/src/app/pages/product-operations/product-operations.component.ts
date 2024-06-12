import { Component } from '@angular/core';
import { TableComponent } from './table/table.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-operations',
  standalone: true,
  imports: [TableComponent, ProductFormComponent],
  templateUrl: './product-operations.component.html',
  styleUrl: './product-operations.component.css'
})
export class ProductOperationsComponent {
  productName! : string;
  products! : Array<any>;
  productSelected : any = {
    make: "",
      model: "",
      price: "",
      electric: true,
      month: "",
  };
  isProductSelected : boolean = false;
  

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // Suscríbete a los parámetros de la ruta para obtener el nombre del producto
    this.route.paramMap.subscribe(params => {
      this.productName = params.get('product')!;
      this.loadProductData(this.productName);
    });
  }

  public onProductSelectedChanged(product: any) {
    this.productSelected = product;
    this.isProductSelected = true;
  }

  // Método para cargar los datos del producto
  loadProductData(productName: string): void {
    // Aquí puedes implementar la lógica para cargar los datos del producto
    console.log(`Producto cargado: ${productName}`);
  }

}
