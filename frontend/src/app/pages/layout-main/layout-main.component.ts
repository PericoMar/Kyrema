import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SocietyService } from '../../services/society.service';
import { NavService } from '../../services/nav.service';
import { LoadingComponent } from '../loading/loading.component';
import { Society } from '../../interfaces/society';

interface User {
  id: string,
  nombre: string,
  usuario: string,
  nivel: string,
  id_sociedad: string
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
