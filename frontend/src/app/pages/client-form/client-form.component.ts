import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ClientProductFormComponent } from './product-form/client-product-form.component';
import { ActivatedRoute } from '@angular/router';
import { SocietyService } from '../../services/society.service';
import { Society } from '../../interfaces/society';
import { SnackBarService } from '../../services/snackBar/snack-bar.service';
import { ProductsService } from '../../services/products.service';
import { FamilyProductService } from '../../services/family-product.service';
import { ActionButtonsComponent } from '../society-manager/society-table/action-buttons/action-buttons.component';
import { CamposService } from '../../services/campos.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ClientProductFormComponent, HeaderComponent, CommonModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit{

  comercial_id: string = "";
  sociedad!: Society;

  productUrl: string = "";
  tipo_producto!: any;
  productName: any = "";
  columnDefs: any;
  router: any;
  comercial: any;
  camposFormulario: any;
  productSelected: any;
  camposLoaded: boolean = false;
  camposSubproductos: any;
  formLoaded!: boolean;

  @Output() sociedadEmitida = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private societyService: SocietyService,
    private snackBarService: SnackBarService,
    private familyService: FamilyProductService,
    private camposService: CamposService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.comercial_id = params.get('comercial_id')!;
      console.log("Comercial", this.comercial_id);
      this.productUrl = params.get('product')!;
      this.societyService.getSociedadPorComercial(this.comercial_id).subscribe({
        next: (sociedad : any) => {
          try {
            this.sociedad = sociedad;
            console.log("Sociedad mandada", this.sociedad);
            this.societyService.actualizarSociedad(sociedad);
            this.loadProductData(this.productUrl);
          } catch (error) {
            console.error(error);
            // Recargar la pagina
            this.snackBarService.openSnackBar("Error al cargar las sociedades, prueba a recargar la página");
          }
        },
        error: (error : any) => {
          console.log(error);
        }
      });
      this.familyService.getTipoProductoPorLetras(this.productUrl).subscribe({
        next: (family : any) => {
          try {
            this.tipo_producto = family;
            this.productName = this.tipo_producto.nombre;
          } catch (error) {
            console.error(error);
            // Recargar la pagina
            this.snackBarService.openSnackBar("Error al cargar el tipo producto, prueba a recargar la página");
          }
        },
        error: (error : any) => {
          console.log(error);
        }
      });
    });  
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

  handleFormLoadedChange(isLoaded: boolean) {
    console.log('Form is loaded:', isLoaded);
    this.formLoaded = isLoaded;
    // Aquí puedes manejar lo que sucede cuando el formulario está cargado
  }
  
}
