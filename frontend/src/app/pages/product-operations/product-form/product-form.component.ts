import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { SocietyService } from '../../../services/society.service';
import { UserService } from '../../../services/user.service';
import { error } from 'console';
import { RatesService } from '../../../services/rates.service';
import { FamilyProductService } from '../../../services/family-product.service';
import { ProductNotificationService } from '../../../services/product-notification.service';

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
  @Input() product!: any | null;
  isLoadingProduct: boolean = false;
  productForm: FormGroup = this.fb.group({});
  @Input() letras_identificacion!: any;
  tipo_producto!: any;
  sociedades: any;
  @Input() campos! : Campo[];
  camposFormularioPorGrupos!: any;
  formIsLoaded : boolean = false;
  tiposPago : {id:string, nombre:string}[] = [
    {id: '1', nombre: 'Tarjeta de crédito'},
    {id: '2', nombre: 'Transferencia bancaria'},
    {id: '3', nombre: 'Domiciliación bancaria'}
  ];


  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private societyService: SocietyService,
    private userService: UserService,
    private rateService : RatesService,
    private familyService: FamilyProductService,
    private productNotificationService: ProductNotificationService
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
      fecha_de_nacimiento: ['', Validators.required],
      prima_del_seguro: [{value: '', disabled: true}, Validators.required],
      cuota_de_asociación: [{value: '', disabled: true}, Validators.required],
      precio_total: [{value: '', disabled: true}, Validators.required],
      tipo_de_pago_id: ['', Validators.required],
    });

    this.familyService.getTipoProductoPorLetras(this.letras_identificacion).subscribe(
      data => {
        this.tipo_producto = data;
        this.loadPago(this.societyService.getCurrentSociety().id);
      },
      error => {
        console.error(error);
      }
    );

    // Cargar las sociedades
    this.loadSociedades();
    this.createForm(this.campos);

    this.productForm.get('sociedad_id')!.valueChanges.subscribe(value => {
      if(!this.isLoadingProduct){
        this.onSociedadChange(value);
      }
    });
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      this.isLoadingProduct = true;
      console.log(this.product);  
      this.productForm.patchValue(this.product);
      this.isLoadingProduct = false
    }

    if(changes['campos']){
      console.log("Campos", this.campos);
      this.createForm(this.campos);
    }
  }

  onSociedadChange(sociedad_id: string) {
    this.loadPago(sociedad_id);
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

  loadPago(id_sociedad : string) : void{
    this.rateService.getTarifasPorSociedadAndTipoProducto(id_sociedad, this.tipo_producto.id).subscribe(
      data => {
        console.log("Tarifas", data);
        this.productForm.controls['prima_del_seguro'].setValue(data[0].prima_seguro);
        this.productForm.controls['cuota_de_asociación'].setValue(data[0].cuota_asociacion);
        this.productForm.controls['precio_total'].setValue(data[0].precio_total);
        this.productForm.controls['tipo_de_pago_id'].setValue(this.tiposPago[0].id);
      },
      error => {
        console.error(error);
      });
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
    console.log(this.productForm.value);
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
    this.productForm.get('prima_del_seguro')?.enable();
    this.productForm.get('cuota_de_asociación')?.enable();
    this.productForm.get('precio_total')?.enable();
    console.log(this.productForm.value);

    // Hacer las comprobaciones correspondientes antes de enviar el formulario
    
    const nuevoProducto = this.productForm.value;
    
    // Agregar el nombre de la sociedad seleccionada al objeto nuevoProducto
    const sociedadSeleccionada = this.sociedades.find((sociedad :any)=> sociedad.id === nuevoProducto.sociedad_id);
    nuevoProducto.sociedad = sociedadSeleccionada ? sociedadSeleccionada.nombre : '';

    // Agregar el id del comercial al objeto nuevoProducto
    const comercial_id = this.userService.getCurrentUser().id;
    nuevoProducto.comercial_id = comercial_id;

    const tipo_de_pago = this.tiposPago.find((tipo: any) => tipo.id === nuevoProducto.tipo_de_pago_id);
    nuevoProducto.tipo_de_pago = tipo_de_pago ? tipo_de_pago.nombre : '';

    //Si no tiene id se está creando un nuevo producto
    if(this.productForm.value.id == null || this.productForm.value.id == ''){
      delete nuevoProducto.id;
      this.productsService.crearProducto(this.letras_identificacion, nuevoProducto).subscribe(
        data => {
          console.log(data);
          this.productForm.get('prima_del_seguro')?.disable();
          this.productForm.get('cuota_de_asociación')?.disable();
          this.productForm.get('precio_total')?.disable();
          this.productNotificationService.notifyChangesOnProducts();
        },
        error => {
          console.log(error);
        }
      )
    } else {
      //Si tiene id se está editando un producto
      this.productsService.editarProducto(this.letras_identificacion, nuevoProducto).subscribe(
        data => {
          console.log(data);
          this.productForm.get('prima_del_seguro')?.disable();
          this.productForm.get('cuota_de_asociación')?.disable();
          this.productForm.get('precio_total')?.disable();
          this.productNotificationService.notifyChangesOnProducts();
        },
        error => {
          console.log(error);
        }
      )
    }
  }
}
