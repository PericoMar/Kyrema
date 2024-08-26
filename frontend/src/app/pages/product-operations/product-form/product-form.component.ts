import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, Renderer2, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { SocietyService } from '../../../services/society.service';
import { UserService } from '../../../services/user.service';
import { RatesService } from '../../../services/rates.service';
import { FamilyProductService } from '../../../services/family-product.service';
import { ProductNotificationService } from '../../../services/product-notification.service';
import { AnexosService } from '../../../services/anexos.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonSpinnerComponent } from '../../../components/button-spinner/button-spinner.component';
import { AppConfig } from '../../../../config/app-config';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';

interface Campo {
  aparece_formulario: boolean, 
  columna: string, 
  created_at: string, 
  fila: string, 
  id: string, 
  nombre: string, 
  nombre_codigo?: string,
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
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, FormsModule, MatIconModule, MatSnackBarModule, ButtonSpinnerComponent, SpinnerComponent],
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
  precioFinal! : any;

  tiposAnexos: any[] = [];
  formatosAnexos!: any;
  tarifasAnexos!: any;
  anexos: any[] = [];
  camposAnexo!: any;

  loadingAction: boolean = false;
  downloadingAnexo: { [key: string]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private societyService: SocietyService,
    private userService: UserService,
    private rateService : RatesService,
    private familyService: FamilyProductService,
    private productNotificationService: ProductNotificationService,
    private anexosService: AnexosService,
    private snackBar: MatSnackBar
  ) { 
    
  }

  @ViewChildren('anexoElement') anexoElements!: QueryList<ElementRef>;

  ngOnInit() {
    

    
    this.loadTipoProducto();
    // Cargar las sociedades
    this.loadSociedades();
    this.createForm(this.campos);

    this.productForm.get('sociedad_id')!.valueChanges.subscribe(value => {
      if(!this.isLoadingProduct){
        this.onSociedadChange(value);
      }
    });
    
  }

  ngAfterViewInit() {
    this.anexoElements.changes.subscribe(() => {
      // Si no está editando uno existente.
      if(this.product.id == '' || this.product.id == null){ 
        const lastAnexoElement = this.anexoElements.last;
        if (lastAnexoElement) {
          lastAnexoElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      this.isLoadingProduct = true;
      console.log(this.product);  
      this.productForm.patchValue(this.product);
      if(this.product.id != null && this.product.id != ''){
        this.loadAnexoPorProducto();
      }
      this.getPrecioFinal();
      this.isLoadingProduct = false;
    }

    if(changes['campos'] || changes['letras_identificacion']){
      this.loadTipoProducto();      
      this.createForm(this.campos);
      this.loadSociedades(); 
      if(this.product.id != null && this.product.id != ''){
        this.loadAnexoPorProducto();
      }
    }
  }

  onSociedadChange(sociedad_id: string) {
    this.loadPago(sociedad_id);
    this.loadTarifasPorAnexo(sociedad_id);
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

  loadTipoProducto(){
    this.familyService.getTipoProductoPorLetras(this.letras_identificacion).subscribe(
      data => {
        this.tipo_producto = data;
        this.loadPago(this.societyService.getCurrentSociety().id);
        // Aquí se cargan todos los datos necesarios para gestionar los anexos:
        this.loadTiposAnexos();
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
        this.getPrecioFinal();
      },
      error => {
        console.error(error);
      });
  }

  loadTiposAnexos(){
    //  Cargar los tipos de anexos asociados al tipo de producto
    this.anexosService.getTipoAnexosPorTipoProducto(this.tipo_producto.id).subscribe({
      next: (tiposAnexos: any[]) => {
        this.tiposAnexos = tiposAnexos;
        console.log('tiposAnexos: ', this.tiposAnexos);
        // Cargamos los campos de todos los tipos de anexos
        this.loadCamposAnexo();
        this.loadTarifasPorAnexo(this.sociedades[0].id);
        
      },
      error: (error: any) => {
        console.error('Error loading tiposAnexos', error);
      }
    });
  }

  loadCamposAnexo() {
    // Inicializar camposAnexo como un objeto vacío
    this.camposAnexo = {};
  
    // Crear una promesa que se resuelve cuando todos los campos de los anexos se han cargado
    const promises = this.tiposAnexos.map((tipoAnexo: any) => {
      return new Promise<void>((resolve, reject) => {
        this.anexosService.getCamposPorTipoAnexo(tipoAnexo.id).subscribe({
          next: (camposAnexo: any[]) => {
            // Asignar los campos al tipo de anexo correspondiente
            this.camposAnexo[tipoAnexo.id] = camposAnexo;
            resolve(); // Resolver la promesa cuando la carga se complete
          },
          error: (error: any) => {
            console.error('Error loading anexos', error);
            reject(error); // Rechazar la promesa en caso de error
          }
        });
      });
    });
  
    // Esperar a que todas las promesas se resuelvan
    Promise.all(promises).then(() => {
      // Una vez que todos los campos se hayan cargado, cargar los formatos
      this.loadFormatosAnexos();
    }).catch((error) => {
      console.error('Error al cargar todos los campos de anexos', error);
    });
  }

  loadTarifasPorAnexo(sociedad_id: any){
    this.tarifasAnexos = {};
    this.tiposAnexos.forEach((tipoAnexo: any) => {
      this.rateService.getTarifaPorSociedadAndTipoAnexo(AppConfig.SOCIEDAD_ADMIN_ID, tipoAnexo.id).subscribe({
        next: (tarifas: any[]) => {
          this.tarifasAnexos[tipoAnexo.id] = tarifas;
          
        },
        error: (error: any) => {
          console.error('Error loading tarifas por anexo', error);
        }
      });
    });
    console.log('Tarifas por anexo: ', this.tarifasAnexos);
    this.getPrecioFinal();
  }

  loadFormatosAnexos() {
    // Inicializar formatosAnexos como un objeto vacío
    this.formatosAnexos = {};
  
    // Iterar sobre los tipos de anexos
    this.tiposAnexos.forEach((tipoAnexo: any) => {
      // Inicializar el formato de anexos para el tipo de anexo actual
      this.formatosAnexos[tipoAnexo.id] = {};
  
      // Comprobar si existen camposAnexo para el tipo de anexo
      if (this.camposAnexo[tipoAnexo.id]) {
        this.camposAnexo[tipoAnexo.id].forEach((campoAnexo: any) => {
          // Definir el valor por defecto basado en el tipo de dato
          let valorDefault: any = this.getDefaultValue(campoAnexo.tipo_dato);
          // Añadir al formato de anexos con nombre_codigo como clave y valorDefault como valor
          this.formatosAnexos[tipoAnexo.id][campoAnexo.nombre_codigo] = valorDefault;
        });
      }
    });
  
    // Log para ver los resultados
    console.log('Formatos anexos: ', this.formatosAnexos);
    this.formIsLoaded = true;
  }

  loadAnexoPorProducto() {
    if (this.tipo_producto && this.product.id != null) {
        this.anexosService.getAnexosPorProducto(this.tipo_producto.id, this.product.id).subscribe({
            next: (anexos: any[]) => {
                // Iterar sobre los anexos obtenidos y añadir la tarifa correspondiente
                this.anexos = anexos.map(anexo => {
                    // Clonar el objeto formato para evitar referencias compartidas
                    const nuevoFormato = { ...anexo.formato };

                    // Añadir la tarifa correspondiente
                    const tarifa = this.tarifasAnexos[anexo.tipo_anexo.id];

                    return {
                        ...anexo,
                        formato: nuevoFormato, // Usar la copia independiente del formato
                        tarifas: tarifa // Añadir la tarifa
                    };
                });

                console.log('Anexos: ', this.anexos);
            },
            error: (error: any) => {
                console.error('Error loading anexos', error);
            },
            complete: () => {
                this.getPrecioFinal();
            }
        });
    }
}


  addAnexo(tipo_anexo: any) {
    // Clonar el objeto formato para evitar referencias compartidas
    const nuevoFormato = { ...this.formatosAnexos[tipo_anexo.id] };

    this.anexos.push({
        id: '',
        formato: nuevoFormato, // Usar la copia independiente
        tipo_anexo: tipo_anexo,
        tarifas: this.tarifasAnexos[tipo_anexo.id] // Asumiendo que esto no necesita ser clonado
    });

    console.log('Anexos', this.anexos);
    
    setTimeout(() => {
        const lastAnexoElement = this.anexoElements.last;
        if (lastAnexoElement) {
            lastAnexoElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, 0);
    
    this.getPrecioFinal();
}


  removeAnexo(index: number){
    this.anexos.splice(index , 1);
    this.getPrecioFinal();
  }

  createForm(campos: Campo[]) {
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
    this.camposFormularioPorGrupos = {};
    campos.forEach((campo : Campo) => {

      // Este if lo que hace es que si no existe el grupo en el array asociativo lo crea:
      if (this.camposFormularioPorGrupos[campo.grupo] == null) {
        this.camposFormularioPorGrupos[campo.grupo] = [];
      }
      let name; 
      if(campo.nombre_codigo != null){
        name = campo.nombre_codigo;
      } else {
        name = campo.nombre.replace(/ /g, '_').toLowerCase();
      }
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
    this.anexos = [];
    this.productForm.patchValue({sociedad_id: this.sociedades[0].id});
  }

  isFieldRequired(grupo: string, field: string): boolean {
    const grupoCampos = this.camposFormularioPorGrupos[grupo];
    if (!grupoCampos) {
      return false;
    }
  
    const campo = grupoCampos.find((campo: any) => campo.name === field);
    return campo ? campo.obligatorio == 1 : false;
  }


  onSubmit() {
    this.productForm.get('prima_del_seguro')?.enable();
    this.productForm.get('cuota_de_asociación')?.enable();
    this.productForm.get('precio_total')?.enable();
    console.log(this.productForm.value);
    console.log('Anexos', this.anexos);

    // Hacer las comprobaciones correspondientes antes de enviar el formulario
    
    this.loadingAction = true;
    const nuevoProducto = this.productForm.value;
    
    // Agregar el nombre de la sociedad seleccionada al objeto nuevoProducto
    const sociedadSeleccionada = this.sociedades.find((sociedad :any)=> sociedad.id === nuevoProducto.sociedad_id);
    nuevoProducto.sociedad = sociedadSeleccionada ? sociedadSeleccionada.nombre : '';

    // Agregar el id del comercial al objeto nuevoProducto
    const comercial_id = this.userService.getCurrentUser().id;
    nuevoProducto.comercial_id = comercial_id;

    const tipo_de_pago = this.tiposPago.find((tipo: any) => tipo.id === nuevoProducto.tipo_de_pago_id);
    nuevoProducto.tipo_de_pago = tipo_de_pago ? tipo_de_pago.nombre : '';

    nuevoProducto.numero_anexos = this.anexos.length;
    nuevoProducto.precio_final = this.precioFinal;

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
          this.conectarAnexosConProductos(this.anexos, data.id);
          this.snackBar.open('Seguro creado con éxito', 'Cerrar', {
            duration: 3000, // Duración en milisegundos
            horizontalPosition: 'right', // Posición horizontal: start, center, end, left, right
            verticalPosition: 'bottom',  // Posición vertical: top, bottom
            panelClass: ['custom-snackbar']
          })
          this.loadingAction = false;
        },
        error => {
          console.log(error);
        }
      )
    } else {
      console.log(nuevoProducto);
      //Si tiene id se está editando un producto
      this.productsService.editarProducto(this.letras_identificacion, nuevoProducto).subscribe(
        data => {
          console.log(data);
          this.productForm.get('prima_del_seguro')?.disable();
          this.productForm.get('cuota_de_asociación')?.disable();
          this.productForm.get('precio_total')?.disable();
          this.productNotificationService.notifyChangesOnProducts();
          this.conectarAnexosConProductos(this.anexos, data.id);
          this.loadingAction = false; 
        },
        error => {
          console.log(error);
        }
      )
    }
    
  }

  getDefaultValue(tipoDato: string): any {
    switch (tipoDato) {
      case 'text':
      case 'number':
        return '';
      case 'decimal':
        return 0;
      case 'date':
        return null;
      default:
        return null;
    }
  }

  objectLength(obj: any): number {
    return Object.keys(obj).length;
  }

  conectarAnexosConProductos(anexos: any, id_producto: any){
    this.anexosService.conectarAnexosConProductos(anexos, id_producto).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error: any) => {
        console.error('Error connecting anexos with products', error);
      }
    });
  }

  getPrecioFinal() {
    // Asegúrate de que `precio_total` sea un número
    this.precioFinal = parseFloat(this.productForm.get('precio_total')?.value) || 0;
    
    // Sumar el precio de los anexos al precio total
    this.precioFinal += this.anexos.reduce((acc: number, anexo: any) => {
      return acc + (parseFloat(anexo.tarifas.precio_total) || 0);
    }, 0);
  }

  downloadAnexo(tipoAnexo: any) {
    // Establece el estado de carga solo para el botón específico
    this.downloadingAnexo[tipoAnexo.id] = true;

    this.anexosService.downloadAnexo(tipoAnexo.id, this.productForm.value.id).subscribe({
      next: (response: any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const nombreSocio = this.productForm.value.nombre_socio ? `_${this.productForm.value.nombre_socio}` : '';
        const apellido1 = this.productForm.value.apellido_1 ? `_${this.productForm.value.apellido_1}` : '';
        const apellido2 = this.productForm.value.apellido_2 ? `_${this.productForm.value.apellido_2}` : '';
        const nombreArchivo = `${tipoAnexo.nombre}_${this.productForm.value.codigo_producto}${nombreSocio}${apellido1}${apellido2}.pdf`;

        a.download = nombreArchivo;

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error: any) => {
        console.error('Error downloading the file', error);
      },
      complete: () => {
        // Restablece el estado de carga solo para el botón específico
        this.downloadingAnexo[tipoAnexo.id] = false;
      }
    });
  }

}
