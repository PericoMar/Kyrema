import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { SocietyService } from '../../../services/society.service';
import { UserService } from '../../../services/user.service';
import { error } from 'console';

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
export class ProductFormComponent implements OnInit, OnChanges{
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
    
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      id: [''],
      sociedad_id: ['', Validators.required],
      nombre_socio: ['', Validators.required],
      apellido_1: ['', Validators.required],
      apellido_2: ['', Validators.required],
      dni: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      sexo: ['', Validators.required],
      dirección: ['', Validators.required],
      población: ['', Validators.required],
      provincia: ['', Validators.required],
      codigo_postal: ['', Validators.required],
      fecha_de_nacimiento: ['', Validators.required]
    });

    // Cargar las sociedades
    this.loadSociedades();
    this.createForm(this.campos);
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      console.log(this.product);  
      this.productForm.patchValue(this.product);
    }

    if(changes['campos']){
      console.log("Campos", this.campos);
      this.createForm(this.campos);
    }
  }

  loadSociedades(): void {
    this.societyService.getSociedadesHijasObservable().subscribe(
      data => {
        this.sociedades = data;
        console.log("Sociedades hijas", this.sociedades);
        // Actualiza el formControl sociedad_id con el primer valor disponible en sociedades
        if (this.sociedades.length > 0) {
          this.productForm.controls['sociedad_id'].setValue(this.sociedades[0].id);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  createForm(campos: Campo[]) {

    this.camposFormularioPorGrupos = {};
    campos.forEach((campo : Campo) => {

      // Este if lo que hace es que si no existe el grupo en el array asociativo lo crea:
      if (this.camposFormularioPorGrupos[campo.grupo] == null) {
        this.camposFormularioPorGrupos[campo.grupo] = [];
      }
      const name = campo.nombre.replace(/ /g, '_').toLowerCase();
      const label = campo.nombre;
      const tipo_dato = campo.tipo_dato;
      const obligatorio = campo.obligatorio;

      // Saltar el procesamiento si el grupo es 'datos_asegurado'
      if (campo.grupo !== 'datos_asegurado') {
        this.productForm.addControl(
          name,
          obligatorio ? new FormControl('', Validators.required) : new FormControl('')
        );
      }
      
      this.camposFormularioPorGrupos[campo.grupo].push({name, label , tipo_dato, obligatorio});
    });

  }


  eliminateProductSelected() {
    this.productForm.reset();
    this.productForm.patchValue({sociedad_id: this.sociedades[0].id});
  }


  isFieldRequired(grupo: string, field: string): boolean {
    const grupoCampos = this.camposFormularioPorGrupos[grupo];
    if (!grupoCampos) {
      return false;
    }
  
    const campo = grupoCampos.find((campo: any) => campo.name === field);
    return campo ? campo.obligatorio : false;
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
      delete nuevoProducto.id;
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
