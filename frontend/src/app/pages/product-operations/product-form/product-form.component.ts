import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CamposService } from '../../../services/campos.service';
import { error } from 'console';
import { ProductsService } from '../../../services/products.service';
import { SocietyService } from '../../../services/society.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() isProductSelected : boolean = false;
  @Input() product!: any | null;
  productForm: FormGroup = this.fb.group({});
  @Input() tipo_producto!: any;
  sociedades: any;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private societyService: SocietyService,
    private userService: UserService
  ) { 
    this.isProductSelected = false;
  }

  ngOnInit() {
    this.sociedades = this.societyService.getSociedadesHijas();
    console.log(this.sociedades);
    if (this.product) {
      this.createForm(this.product);
      console.log(this.product);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      this.isProductSelected = true;
      console.log(this.product);  
      this.createForm(this.product);
    }
  }

  createForm(product: any) {
    const formGroup: any = {};

    Object.keys(product).forEach(key => {
      formGroup[key] = new FormControl(product[key]);
    });

    // Agregar el campo sociedad al formGroup
    formGroup['sociedad_id'] = new FormControl(this.sociedades.length > 0 ? this.sociedades[0].id : '');

    this.productForm = this.fb.group(formGroup);
  }

  productKeys(): string[] {
    return this.product ? Object.keys(this.product) : [];
  }

  getInputType(key: string): string {
    const value = this.product[key];
  
    if (typeof value === 'number') {
      return 'number';
    } else if (typeof value === 'boolean') {
      return 'checkbox';
    } else if (this.isDate(value)) {
      return 'date';
    } else {
      return 'text';
    }
  }

  isDate(value: any): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  capitalizeFirstLetter(key: string): string {
    // Reemplazar guiones bajos por espacios y dividir por espacios
    const words = key.replace(/_/g, ' ').split(' ');
    
    // Capitalizar la primera letra de cada palabra
    const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    // Unir las palabras capitalizadas con espacios y devolver
    return capitalizedWords.join(' ');
}

  eliminateProductSelected() {
    const emptyProduct: any = {};
    Object.keys(this.product).forEach(key => {
      const value = this.product[key];
      if (typeof value === 'boolean') {
        emptyProduct[key] = false;
      } else if (typeof value === 'string') {
        emptyProduct[key] = '';
      } else {
        emptyProduct[key] = null;
      }
    });
    this.product = emptyProduct;
    this.createForm(this.product);
    this.isProductSelected = false;
  }
  onSubmit() {
    console.log(this.productForm.value);

    // Hacer las comprobaciones correspondientes antes de enviar el formulario
    
    const nuevoProducto = this.productForm.value;
    
    // Agregar el nombre de la sociedad seleccionada al objeto nuevoProducto
    const sociedadSeleccionada = this.sociedades.find((sociedad :any)=> sociedad.id === nuevoProducto.sociedad_id);
    nuevoProducto.sociedad = sociedadSeleccionada ? sociedadSeleccionada.nombre : '';

    // Agregar el id del comercial al objeto nuevoProducto
    const comercial_id = this.userService.getCurrentUser().id;
    nuevoProducto.comercial_id = comercial_id;

    //Si no tiene id se está creando un nuevo producto
    if(this.product.id == null || this.product.id == ''){
      this.productsService.crearProducto(this.tipo_producto, nuevoProducto).subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      )
    } else {
      //Si tiene id se está editando un producto
      this.productsService.editarProducto(this.tipo_producto, nuevoProducto).subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      )
    }
  }
}
