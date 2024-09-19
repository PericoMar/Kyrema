import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SocietyService } from '../../services/society.service';
import { NavService } from '../../services/nav.service';
import { LoadingComponent } from '../loading/loading.component';

interface User {
  id: string,
  nombre: string,
  usuario: string,
  nivel: string,
  id_sociedad: string
}

interface Society {
  id: string,
  nombre : string,
  codigo_postal : string,
  poblacion :string,
  tipo_sociedad: string,
  nivel_sociedad: string,
  logo: string,
  sociedad_padre_id: string,
  created_at: string,
  updated_at: string;
  codigo_sociedad : string
}

interface MenuItem {
  label: string;
  children?: MenuItem[];
  link?: string;
}

@Component({
  selector: 'app-layout-main',
  standalone: true,
  imports: [HeaderComponent, RouterModule, LoadingComponent],
  templateUrl: './layout-main.component.html',
  styleUrl: './layout-main.component.css'
})
export class LayoutMainComponent {
  user! : User;
  society! : Society;
  comercial_id!: string;
  logoUrl! : string | null;
  navigation!: MenuItem[];
  pageLoading: boolean = true;

  constructor(
    private userService : UserService,
    private societyService : SocietyService,
    private navService : NavService,
    private router : Router,
    private route : ActivatedRoute
  ){}

  ngOnInit(): void {
    if(this.router.url.includes('/contratar')){
      this.route.paramMap.subscribe(params => {
        console.log('params:', params);
        this.comercial_id = params.get('comercial_id')!;
        console.log('comercial_id:', this.comercial_id); 
        this.societyService.getSociedadPorComercial(this.comercial_id).subscribe({
          next: (sociedad : any) => {
            try {

              this.society = sociedad;
              console.log('Sociedad:', this.society);
              this.logoUrl = this.society.logo ? this.society.logo : '../../../assets/Logo_CANAMA__003.png';

            } catch (error) {
              console.error(error);
            }
          },
          error: (error : any) => {
            console.log(error);
          }
        });
      });
    } else {

      this.user = this.userService.getCurrentUser();
      this.navService.getNavegation(this.user.id_sociedad).subscribe(
        data => {
          this.navigation = data;
          console.log(this.navigation)
        },
        (error) => {
          console.error('Error fetching navigation:', error);
        }
      );
      this.societyService.getSocietyById(this.user.id_sociedad).subscribe(
        data => {
          this.society = data;
          this.societyService.setSociedadLocalStorage(this.society);
          
          this.societyService.getSociedadAndHijas(this.society.id).subscribe(
            (sociedad : Society[]) => {
              this.societyService.guardarSociedadesEnLocalStorage(sociedad);
            },
            (error) => {
              console.error('Error fetching societies:', error);
              this.router.navigate(['/login']);
            },
            () => {
              this.pageLoading = false;
            }
          )
        },
        error => {
          console.error('Error al obtener la sociedad:', error);
        }
      );

      }


  }
}
