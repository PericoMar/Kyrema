import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { SocietyService } from '../../../services/society.service';
import { UserService } from '../../../services/user.service';

interface Campo {
  aparece_formulario: boolean, 
  columna: string, 
  created_at: string, 
  fila: string, 
  id: string, 
  nombre: string, 
  obligatorio: boolean, 
  tipo_dato: string, 
  tipo_producto_id: string, 
  updated_at: string, 
  visible: boolean,
  grupo: string
}

interface CampoFormulario{
  name: string,
  label: string,
  tipo_dato: string,  
}

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
  @Input() campos!: Campo[];
  camposFormularioPorGrupos!: any;
  formIsLoaded : boolean = false;


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
    console.log("Sociedades", this.sociedades);
    this.createForm(this.campos);
    console.log(this.product);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      this.isProductSelected = true;
      console.log(this.product);  
      this.productForm.setValue(this.product);
    }
  }

  createForm(campos: Campo[]) {
     // Necesito un array asociativo donde la clave sea el nombre del grupo (Cada campo tiene un grupo asociado),
    // además el valor de cada grupo será un array con todos los campos donde cada campo será un objeto con la información del campo: 
    // name (nombre cambiando espacios por _ y en minusculas), label: El nombre "bonito", value el valor del producto que paso por parametro,
    // tipo_dato es el tipo de dato que le llega del backend.
    this.camposFormularioPorGrupos = {};
    campos.forEach((campo : Campo) => {
      // Este if lo que hace es que si no existe el grupo en el array asociativo lo crea:
      if (this.camposFormularioPorGrupos[campo.grupo] == null) {
        this.camposFormularioPorGrupos[campo.grupo] = [[]];
      }
      const name = campo.nombre.replace(/ /g, '_').toLowerCase();
      const label = campo.nombre;
      const tipo_dato = campo.tipo_dato;
      const obligatorio = campo.obligatorio;
      this.camposFormularioPorGrupos[campo.grupo][name].push({name, label , tipo_dato, obligatorio});
    });

    const formGroupConfig: any = {};

    Object.keys(this.camposFormularioPorGrupos).forEach((grupo: string) => {
      this.camposFormularioPorGrupos[grupo].forEach((campo :any) => {
          formGroupConfig[campo.name] =  campo.obligatorio ? new FormControl('', Validators.required) : new FormControl('');
      });
    });

    // Añade el control para 'sociedad_id' como un FormControl
    formGroupConfig['sociedad_id'] = new FormControl(this.sociedades.length > 0 ? this.sociedades[0].id : '');

    // Crea el FormGroup usando los campos organizados
    this.productForm = this.fb.group(formGroupConfig);
    this.formIsLoaded = true;

  }


  productKeys(): string[] {
    return this.product ? Object.keys(this.product) : [];
  }

  getInputType(key: string): string {
    const value = this.product[key];
    console.log("Input type", key, "valor", value, "tipo", typeof value);
    if (typeof value === 'string') {
      return 'text';
    } else if (typeof value === 'number') {
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
    // Comprobar si el valor es una instancia de Date
    if (!(value instanceof Date)) {
        // Intentar convertir el valor a Date
        value = new Date(value);
        // Si no se puede convertir a Date, entonces no es una fecha válida
        if (!(value instanceof Date)) {
            return false;
        }
    }

    // Comprobar si el valor es un objeto Date válido
    if (isNaN(value.getTime())) {
        return false;
    }

    // Si pasa todas las comprobaciones, se considera una fecha válida
    return true;
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
