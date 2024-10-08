import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, Renderer2, SimpleChanges, ViewChildren } from '@angular/core';
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
import { ButtonSpinnerComponent } from '../../../components/button-spinner/button-spinner.component';
import { AppConfig } from '../../../../config/app-config';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import { CamposService } from '../../../services/campos.service';
import { SnackBarService } from '../../../services/snackBar/snack-bar.service';
import { catchError, map, Observable, of } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { Society } from '../../../interfaces/society';
import { PaymentService } from '../../../services/payment.service';
import { Router } from '@angular/router';

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
  obligatorio: boolean,
  opciones?: any[] 
}

@Component({
  selector: 'app-client-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, FormsModule, MatIconModule, ButtonSpinnerComponent, SpinnerComponent, NgSelectModule],
  templateUrl: './client-product-form.component.html',
  styleUrls: ['./client-product-form.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('void', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden',
      })),
      state('*', style({
        height: '*',
        opacity: 1,
      })),
      transition(':enter', [
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in')
      ])
    ])
  ]
})
export class ClientProductFormComponent implements OnInit, OnChanges{
  @Input() product!: any | null;
  isLoadingProduct: boolean = false;
  productForm: FormGroup = this.fb.group({});

  @Input() letras_identificacion!: any;
  @Input() tipo_producto!: any;
  @Input() subproducto_id!: any;
  @Input() campos! : Campo[];

  @Input() sociedad!: Society;
  comercialActual: any = this.userService.getCurrentUser();
  comerciales!: any[];

  @Input() tipo_duracion_padre: any;
  @Input() duracion_padre: any;

  camposFormularioPorGrupos!: any;

  formIsLoaded : boolean = true;
  @Output() formLoadedChange = new EventEmitter<boolean>();

  tiposPago! : {id:string, nombre:string}[];

  precioFinal! : number;
  precioInicialSelects : number = 0;
  previousSelections: { [key: string]: any } = {};

  tiposAnexos: any[] = [];
  formatosAnexos!: any;
  tarifasAnexos!: any;
  anexos: any[] = [];
  camposAnexo!: any;

  @Input() camposSubproductos!: any[];
  selectedSubproducto: any;

  loadingAction: boolean = false;
  downloadingAnexo: { [key: string]: boolean } = {};

  duraciones: any;
  duracion: any;
  minDate!: string;
  fecha_fin!: Date;
  loading!: boolean;
  
  

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private societyService: SocietyService,
    private userService: UserService,
    private rateService : RatesService,
    private familyService: FamilyProductService,
    private camposService: CamposService,
    private productNotificationService: ProductNotificationService,
    private anexosService: AnexosService,
    private snackBarService: SnackBarService,
    private paymentService: PaymentService,
    private router: Router,
  ) { 
    
  }

  @ViewChildren('anexoElement') anexoElements!: QueryList<ElementRef>;

  async ngOnInit() {
    this.createForm(this.campos);
    this.loadTipoProducto();
    // Cargar las sociedades
    // this.loadSociedades();


    // Si selecciono un producto con un subproducto debo cambiar el formulario.
    this.productForm.get('subproducto')?.valueChanges.subscribe(selectedValue => {
        this.onSubproductoIdChange(selectedValue);
    });
    

    // await this.paymentService.initStripe();
    // const elements = this.paymentService.elements;
    // if (elements) {
    //   this.paymentService.card = elements.create('card');
    //   this.paymentService.card.mount('#card-element');
    // }
  }

  ngAfterViewInit() {
    this.anexoElements.changes.subscribe(() => {
      const lastAnexoElement = this.anexoElements.last;
      if (lastAnexoElement) {
        lastAnexoElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['subproducto_id'] && this.subproducto_id !== undefined) {
      console.log('Subproducto id:', this.subproducto_id);
      this.onSubproductoIdChange(this.subproducto_id);
    }
  }


  loadTipoProducto(){
    this.familyService.getTipoProductoPorLetras(this.letras_identificacion).subscribe(
      data => {
        this.tipo_producto = data;
        // Cuando cojo el tipo_producto si tiene subproductos añado el campo subproducto al formulario
        if(this.tipo_producto && this.tipo_producto.subproductos && this.tipo_producto.subproductos.length > 0){
          console.log('crear subproducto');
          this.productForm.addControl(
            'subproducto',
            new FormControl(null, Validators.required)
          );
        }
        this.getDuracion().subscribe({
          next: (duracion: any) => {
            this.duracion = duracion;
            this.productForm.controls['duracion'].setValue(this.duracion);
          },
          error: (error: any) => {
            console.error('Error loading duracion', error);
          }
        });
        // this.loadSubproductos(this.tipo_producto.id);
        this.loadPago(this.societyService.getCurrentSociety().id);
        // Aquí se cargan todos los datos necesarios para gestionar los anexos:
        this.loadTiposAnexos();
      },
      error => {
        console.error(error);
      }
    );
  }

  loadPago(id_sociedad : string | undefined) : void{
    if(id_sociedad != null){
      this.rateService.getTarifasPorSociedadAndTipoProducto(id_sociedad, this.tipo_producto.id).subscribe(
        data => {
          console.log("Tarifas", data);
          this.productForm.controls['precio_base'].setValue(data[0].precio_base);
          this.productForm.controls['extra_1'].setValue(data[0].extra_1);
          this.productForm.controls['extra_2'].setValue(data[0].extra_2);
          this.productForm.controls['extra_3'].setValue(data[0].extra_3);
          this.productForm.controls['precio_total'].setValue(data[0].precio_total);
          this.getPrecioFinal();
        },
        error => {
          console.error(error);
        });
    }
  }

  // loadSubproductos(padre_id : any){
  //   this.familyService.getSubproductosByPadreId(padre_id).subscribe({
  //     next: (subproductos: any[]) => {
  //       this.subproductos = subproductos;
  //     },
  //     error: (error: any) => {
  //       console.error('Error loading subproductos', error);
  //     }
  //   }); 
  // }

  loadTiposAnexos(){
    //  Cargar los tipos de anexos asociados al tipo de producto
    this.anexosService.getTipoAnexosPorTipoProducto(this.tipo_producto.id).subscribe({
      next: (tiposAnexos: any[]) => {
        this.tiposAnexos = tiposAnexos;
        console.log('tiposAnexos: ', this.tiposAnexos);
        // Cargamos los campos de todos los tipos de anexos
        this.loadCamposAnexo();
        this.loadTarifasPorAnexo(this.sociedad.id);
        
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
            this.camposAnexo[tipoAnexo.id] = camposAnexo.filter((campo: any) => campo.grupo !== 'datos_duracion');
            console.log('Campos anexo', this.camposAnexo);
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
          // this.getPrecioFinal();
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
          const today = new Date().toISOString().split('T')[0];
          let valorDefault: any = campoAnexo.nombre_codigo === 'fecha_de_inicio' ? today : this.getDefaultValue(campoAnexo.tipo_dato);
          // Añadir al formato de anexos con nombre_codigo como clave y valorDefault como valor
          this.formatosAnexos[tipoAnexo.id][campoAnexo.nombre_codigo] = valorDefault;
        });
      }
    });
  
    // Log para ver los resultados
    console.log('Formatos anexos: ', this.formatosAnexos);
    this.formIsLoaded = true;
    this.productForm.enable();
    this.disablePrecios();  
    if(this.tipo_producto.tipo_duracion !== 'fecha_exacta' || this.tipo_producto.tipo_duracion !== 'selector_dias'){
      this.productForm.controls['duracion'].disable();
    }
    this.formLoadedChange.emit(this.formIsLoaded);
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
                        tarifas: tarifa, // Añadir la tarifa
                        abierto: false
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

  onSubproductoIdChange(selectedValue: number) {
    const event = { target: { value: selectedValue } }; // simula el evento
    this.onSubproductoChange(event as unknown as Event); // llama al método cuando cambie el valor
  }

  onSubproductoChange(event: Event) {
    // this.eliminateCamposSubproducto();
    console.log('event', event);
    const selectedValue = (event.target as HTMLSelectElement).value;
    if(selectedValue){
      console.log('Selected value:', selectedValue);
      // Coger el subproducto de la lista de subproductos this.tipo_producto.subproductos
      const selectedSubproducto = this.tipo_producto.subproductos.find((subproducto: any) => subproducto.id == selectedValue);
      this.selectedSubproducto = selectedSubproducto;
      console.log('Selected subproducto:', selectedSubproducto);
      // Actualizar el precio total con el precio del subproducto seleccionado
      this.productForm.controls['precio_base'].setValue(selectedSubproducto.tarifas.precio_base);
      this.productForm.controls['extra_1'].setValue(selectedSubproducto.tarifas.extra_1);
      this.productForm.controls['extra_2'].setValue(selectedSubproducto.tarifas.extra_2);
      this.productForm.controls['extra_3'].setValue(selectedSubproducto.tarifas.extra_3);
      this.productForm.controls['precio_total'].setValue(selectedSubproducto.tarifas.precio_total);

      selectedSubproducto.campos.forEach((campo: any) => {
        this.añadirCampoAlFormulario(campo);
      });

      this.letras_identificacion = selectedSubproducto.letras_identificacion;

      if(selectedSubproducto.tipo_duracion !== 'heredada'){
        this.getDuracion(selectedSubproducto).subscribe({
          next: (duracion: any) => {
            this.duracion = duracion;
            this.productForm.controls['duracion'].setValue(this.duracion);
          },
          error: (error: any) => {
            console.error('Error loading duracion', error);
          }
        });
      } 
    }
    this.getPrecioFinal();
  }

  changeOnSelect(event: Event, campo: any): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const selectedOption = campo.opciones.find((opcion: any) => opcion.nombre === selectedValue);
  
    // Restar el precio de la opción previamente seleccionada, si existe
    if (this.previousSelections[campo.name]) {
      this.precioFinal -= this.previousSelections[campo.name].precio || 0;
    }
  
    // Añadir el precio de la nueva opción seleccionada
    // Convertir en number selectedOption.precio para evitar concatenación de cadenas
    const precioSelectedOption = parseFloat(selectedOption.precio);
    this.precioFinal += precioSelectedOption || 0;
  
    // Guardar la nueva opción seleccionada como la opción previa
    this.previousSelections[campo.name] = selectedOption;
  
    console.log('Selected value:', selectedValue);
  }


  addAnexo(tipo_anexo: any) {
    if(this.precioFinal && this.productForm.get('precio_total')?.value){
      // Clonar el objeto formato para evitar referencias compartidas
      const nuevoFormato = { ...this.formatosAnexos[tipo_anexo.id] };

      this.anexos.push({
          id: '',
          formato: nuevoFormato, // Usar la copia independiente
          tipo_anexo: tipo_anexo,
          tarifas: this.tarifasAnexos[tipo_anexo.id], // Asumiendo que esto no necesita ser clonado
          abierto: true
      });

      console.log('Anexos', this.anexos);
      
      setTimeout(() => {
          const lastAnexoElement = this.anexoElements.last;
          if (lastAnexoElement) {
              lastAnexoElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
          }
      }, 0);
      
      this.getPrecioFinal();

      this.snackBarService.openSnackBar('Anexo añadido correctamente. Precio actualizado.');
    } else {
      this.snackBarService.openSnackBar('Por favor, espere a que se carguen los precios.');
    }
  }

  // async pay() {
  //   this.loading = true;
  //   const billingDetails = {
  //     name: 'Nombre del cliente',
  //     email: 'email@ejemplo.com',
  //   };
  //   const cardElement = this.paymentService.card;
  //   console.log("Metodo de pago", cardElement);
  //   // Crea el método de pago
  //   const paymentMethodResponse = await this.paymentService.createPaymentMethod(cardElement, billingDetails);
  //   console.log("Payment method response", paymentMethodResponse);
  //   if (paymentMethodResponse && paymentMethodResponse.paymentMethod) {
  //     const paymentMethodId = paymentMethodResponse.paymentMethod.id; // Usa el ID aquí
  //     const amount = 1000; // Monto en centavos

  //     this.paymentService.pay(paymentMethodId, amount).subscribe({
  //       next: (response) => {
  //         // Manejar la respuesta
  //         console.log('Payment successful:', response);
  //       },
  //       error: (error) => {
  //         // Manejar errores
  //         console.error('Payment error:', error);
  //       }
  //     });
  //   }
  //   this.loading = false;
  // }

  sendPaymentRequest() {
    const paymentData = {
      orderId: '123456',
      amount: 1000,
    };
    console.log('Payment data:', paymentData);
    this.paymentService.initiatePayment(paymentData).subscribe(response => {
      console.log("respuesta correcta")
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = response.redsysUrl;
  
      // Añadir los campos de los parámetros
      for (const [key, value] of Object.entries(response.params)) { 
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      }
  
      // Campo para la firma
      const signatureInput = document.createElement('input');
      signatureInput.type = 'hidden';
      signatureInput.name = 'Ds_Signature';
      signatureInput.value = response.signature;
      form.appendChild(signatureInput);
  
      // Añadir el formulario al documento y enviar
      document.body.appendChild(form);
      console.log(response)
      form.submit();
    },
    error => {
      console.error('Error sending payment request:', error);
    });
  }
  



  removeAnexo(index: number){
    this.anexos.splice(index , 1);
    this.getPrecioFinal();
  }

  agrupar(arr: any[], tamano: number): any[][] {
    const grupos = [];
    for (let i = 0; i < arr.length; i += tamano) {
      grupos.push(arr.slice(i, i + tamano));
    }
    return grupos;
  }

  toggleAnexo(index: number) {
    this.anexos[index].abierto = !this.anexos[index].abierto;
  }
  

  createForm(campos: Campo[]) {
    const today = new Date().toISOString().split('T')[0];
    this.minDate = today;

    this.productForm = this.fb.group({
      id: [''],
      sociedad_id: [this.sociedad.id, Validators.required],
      comercial_creador_id: [this.comercialActual.id],
      comercial_id: [this.comercialActual.id],
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
      // subproducto: [null, Validators.required],
      fecha_de_inicio: [today , Validators.required],
      duracion: [{value: '', disabled: true}, Validators.required],
      precio_base: [{value: '', disabled: true}, Validators.required],
      extra_1: [{value: '', disabled: true}, Validators.required],
      extra_2: [{value: '', disabled: true}, Validators.required],
      extra_3: [{value: '', disabled: true}, Validators.required],
      precio_total: [{value: '', disabled: true}, Validators.required],
      tipo_de_pago_id: ['', Validators.required],
    });
    
    this.camposFormularioPorGrupos = {};
    campos.forEach((campo : Campo) => {
        this.añadirCampoAlFormulario(campo);
    });

    this.onSubproductoIdChange(this.subproducto_id);




    console.log('Campos formulario por grupos', this.camposFormularioPorGrupos);

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
    this.limpiarEstilosErrores();
    this.enablePrecios();
    this.productForm.get('duracion')?.enable();
    console.log(this.productForm.value);
    console.log('Anexos', this.anexos);

    // Hacer las comprobaciones correspondientes antes de enviar el formulario
    
    this.loadingAction = true;
    const nuevoProducto = this.productForm.value;

    //Agregar fecha de inicio y fecha de fin al objeto nuevoProducto
    const fecha_emision = new Date();
    this.fecha_fin = new Date();
    if((this.selectedSubproducto && this.selectedSubproducto.tipo_duracion === 'fecha_exacta') || (!this.selectedSubproducto && this.tipo_producto.tipo_duracion === 'fecha_exacta')){
      this.fecha_fin = new Date(this.duracion);
      //Cambiar el valor de duracion a la diferencia de días entre la fecha de inicio y la fecha de fin
      const diffTime = Math.abs(this.fecha_fin.getTime() - fecha_emision.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // Asignar la diferencia en el nuevoProducto
      nuevoProducto.duracion = diffDays;
    } else {
      this.fecha_fin.setDate(this.fecha_fin.getDate() + parseInt(this.duracion));
    }

    const formatFecha = (fecha: Date) => {
      // Obtener el año, mes y día de la fecha
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve de 0 a 11, por lo que se suma 1
      const day = String(fecha.getDate()).padStart(2, '0');
    
      // Devolver la fecha en formato 'Y-m-d'
      return `${year}-${month}-${day}`;
    };


    nuevoProducto.fecha_de_emisión = formatFecha(fecha_emision);
    nuevoProducto.fecha_de_fin = formatFecha(this.fecha_fin);

    if(this.tipo_producto.padre_id != null){
      nuevoProducto.subproducto = this.productForm.get('subproducto')?.value;
      this.familyService.getTipoProductoPorId(nuevoProducto.subproducto).subscribe({
        next: (subproducto: any) => {
          nuevoProducto.subproducto_codigo = subproducto.nombre;
        },
        error: (error: any) => {
          console.error('Error loading subproducto', error);
        }
      });
    }
    
    
    nuevoProducto.sociedad = this.sociedad.nombre;

    // Agregar el id del comercial al objeto nuevoProducto
    if(nuevoProducto.comercial_id != this.comercialActual.id){
      nuevoProducto.comercial_creador_id = this.comercialActual.id;
    }
    nuevoProducto.comercial = this.comercialActual.nombre;

    nuevoProducto.tipo_de_pago_id = '9';
    nuevoProducto.tipo_de_pago = 'Tarjeta';

    nuevoProducto.numero_anexos = this.anexos.length;
    nuevoProducto.precio_final = this.precioFinal;

    console.log('Nuevo producto', nuevoProducto);

    const arrayUnicoTodosCampos = Object.values(this.camposFormularioPorGrupos).reduce((acc : any, array) => acc.concat(array), []);

    // Comprobar campos vacios:
    const camposVacios = this.verificarCamposObligatorios(arrayUnicoTodosCampos, nuevoProducto);
    if(camposVacios.length > 0){
      console.log(nuevoProducto.duracion);
      this.snackBarService.openSnackBar('Hay campos obligatorios sin rellenar.');
      console.log('Campos vacios', camposVacios);
      this.aplicarEstilosErrores(camposVacios.map((campo: any) => campo.name));
      this.disablePrecios();
      if(this.tipo_producto.tipo_duracion != 'selector_dias' && this.tipo_producto.tipo_duracion != 'fecha_exacta'){
        console.log("Entro en desactivar duracion");
        this.productForm.get('duracion')?.disable();
      }
      this.loadingAction = false;
      return;
    }

    // CREAR O EDITAR PRODUCTO
    // Si no tiene id se está creando un nuevo producto
    if(this.productForm.value.id == null || this.productForm.value.id == ''){
      delete nuevoProducto.id;
      this.productsService.crearProducto(this.letras_identificacion, nuevoProducto).subscribe(
        data => {
          console.log(data);
          this.disablePrecios();
          if(this.anexos.length > 0){
            this.conectarAnexosConProductos(this.anexos, data.id); 
          } else {
            this.snackBarService.openSnackBar('Producto creado con exito');
            this.loadingAction = false;
          }
          this.productNotificationService.notifyChangesOnProducts();
          
        },
        error => {
          console.log(error);
        }
      );
    } else {
      console.log(nuevoProducto);
      //Si tiene id se está editando un producto
      this.productsService.editarProducto(this.letras_identificacion, nuevoProducto).subscribe(
        data => {
          console.log(data);
          this.disablePrecios();
          this.conectarAnexosConProductos(this.anexos, data.id, false);
          this.productNotificationService.notifyChangesOnProducts();
          this.loadingAction = false; 
        },
        error => {
          console.log(error);
        },
        () => {
          this.snackBarService.openSnackBar('Producto editado con exito');
        }
      )
    }
    
  }

  /************************************/
  /************************************/
  /************************************/
  /************************************/

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

  conectarAnexosConProductos(anexos: any, id_producto: any , creando: boolean = true) {
    anexos.forEach((anexo: any) => {
      if(anexo.tipo_anexo.tipo_duracion == 'fecha_dependiente'){
        anexo.formato.fecha_de_fin = this.fecha_fin;
      }
    });
    this.anexosService.conectarAnexosConProductos(anexos, id_producto).subscribe({
      next: (data: any) => {
        console.log(data);
        creando ? this.snackBarService.openSnackBar('Producto creado con exito') : this.snackBarService.openSnackBar('Producto editado con exito');
        this.loadingAction = false;
      },
      error: (error: any) => {
        console.error('Error connecting anexos with products', error);
      }
    });
  }

  getPrecioFinal() {
    // Asegúrate de que `precio_total` sea un número
    // this.precioFinal = parseFloat(this.productForm.get('precio_final')?.value) === 0 ? parseFloat(this.productForm.get('precio_total')?.value) : 0;
    this.precioFinal = parseFloat(this.productForm.get('precio_total')?.value) || 0;
    
    // Sumar el precio de los anexos al precio total
    this.precioFinal += this.anexos.reduce((acc: number, anexo: any) => {
      return acc + (parseFloat(anexo.tarifas.precio_total) || 0);
    }, 0);

    return this.precioFinal;
  }

  getDuracion(subproducto : any = null): Observable<any> {
    this.productForm.get('duracion')?.disable();
    const productoCalculoDuracion = this.tipo_producto.tipo_duracion !== 'heredada' ? this.tipo_producto :
     {tipo_duracion: this.tipo_duracion_padre, duracion: this.duracion_padre};
    console.log('Producto calculo duracion', productoCalculoDuracion);
    if (productoCalculoDuracion.tipo_duracion === 'selector_dias') {
      return this.productsService.getDuraciones(productoCalculoDuracion.duracion).pipe(
        map((duraciones: any) => {
          this.duraciones = duraciones;
          this.duracion = this.duraciones[0].duracion;
          this.productForm.get('duracion')?.enable();
          return this.duracion;  // Devuelve la primera duración
        }),
        catchError((error) => {
          console.error('Error loading duracion', error);
          return of(null); // Retorna un valor por defecto o maneja el error
        })
      );
    } else if(productoCalculoDuracion.tipo_duracion === 'fecha_exacta') {

      this.productForm.get('duracion')?.enable();
      return of(productoCalculoDuracion.duracion);

    } else {
      return of(productoCalculoDuracion.duracion);
    }
  }

  changeDuracion(event : Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const selectedOption = this.duraciones.find((opcion: any) => opcion.duracion === selectedValue);
    this.productForm.controls['duracion'].setValue(selectedOption.duracion);
    this.duracion = selectedOption.duracion;
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
        const nombreArchivo = `${tipoAnexo.letras_identificacion}_${this.productForm.value.codigo_producto}${nombreSocio}${apellido1}${apellido2}.pdf`;

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

  verificarCamposObligatorios(arrayUnicoTodosCampos : any, nuevoProducto : any) : any[] {
    let camposVacios : any = [];
    arrayUnicoTodosCampos.forEach((campo : any) => {
      if (campo.obligatorio === '1') {  // Si el campo es obligatorio
        if (!nuevoProducto[campo.name] || nuevoProducto[campo.name] === '') {
          camposVacios.push(campo);
        }
      }
    });

    return camposVacios;
  }

  limpiarEstilosErrores() {
    // Quitar la clase de error de todos los campos
    const campos = document.querySelectorAll('input');
    campos.forEach((campo: HTMLInputElement) => {
      campo.classList.remove('input-error');
    });
  }

  aplicarEstilosErrores(camposVacios: string[]) {
    // Aplicar la clase de error a los campos vacíos
    camposVacios.forEach(campoNombre => {
      const campo = document.getElementById(campoNombre);
      if (campo) {
        campo.classList.add('input-error');
      }
    });
  }

  eliminateCamposSubproducto() {
    
    this.camposSubproductos.forEach(campo => {

        if (this.productForm.get(campo.nombre_codigo)) {
            // Elimina el campo del formulario
            this.productForm.removeControl(campo.nombre_codigo);

            // Filtra el campo del array 'camposFormularioPorGrupos' basado en su grupo
            if (this.camposFormularioPorGrupos['datos_producto']) {
                

                this.camposFormularioPorGrupos['datos_producto'] = this.camposFormularioPorGrupos['datos_producto'].filter(
                    (campoFormulario: any) => {
                      console.log(campo.name);
                      console.log(campoFormulario);
                      return campoFormulario.name !== campo.nombre_codigo;
                    }
                );
            }
        }
    });

  }


  añadirCampoAlFormulario(campo: Campo) {
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

    if(campo.tipo_dato == 'select'){

      this.camposService.getOpcionesPorCampo(campo.id).subscribe({
        next: (opciones: any) => {
          this.productForm.addControl(
            name,
            obligatorio ? new FormControl('', Validators.required) : new FormControl('')
          );
          this.camposFormularioPorGrupos[campo.grupo].push({name, label , tipo_dato, obligatorio, opciones});
          this.productForm.controls[name].setValue('');
        },
        error: (error: any) => {
          console.error('Error loading opciones', error);
        }
      });


    } else {
      // Saltar el procesamiento si el grupo es 'datos_asegurado'
      if (campo.grupo !== 'datos_asegurado' && campo.grupo !== 'datos_duracion' && campo.grupo !== 'datos_fecha') {
        this.productForm.addControl(
          name,
          obligatorio ? new FormControl('', Validators.required) : new FormControl('')
        );
      }
      
      this.camposFormularioPorGrupos[campo.grupo].push({name, label , tipo_dato, obligatorio});
    }

  }

  disablePrecios(){
    this.productForm.controls['precio_base'].disable();
    this.productForm.controls['extra_1'].disable();
    this.productForm.controls['extra_2'].disable();
    this.productForm.controls['extra_3'].disable();
    this.productForm.controls['precio_total'].disable();
  }

  enablePrecios(){
    this.productForm.controls['precio_base'].enable();
    this.productForm.controls['extra_1'].enable();
    this.productForm.controls['extra_2'].enable();
    this.productForm.controls['extra_3'].enable();
    this.productForm.controls['precio_total'].enable();
  }

}
