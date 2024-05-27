import { Routes } from '@angular/router';
import { ProductOperationsComponent } from './pages/product-operations/product-operations.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { GestionSociedadesComponent } from './pages/gestion-sociedades/gestion-sociedades.component';
import { PagosComponent } from './pages/pagos/pagos.component';

export const routes: Routes = [
    { path: '', component: ProductOperationsComponent }, // Ruta vacía dirige al componente HomeComponent
    { path: 'operaciones/:product', component: ProductOperationsComponent }, 
    { path: 'informes', component: ReportsComponent }, 
    { path: 'sociedades' , component: GestionSociedadesComponent },
    { path: 'sociedades/pagos/:sociedad', component: PagosComponent },
    // { path: 'sociedades/productos/:sociedad', component: ProductosComponent },
    // { path: 'sociedades/permisos/:sociedad', component: PermisosComponent },
    // { path: 'sociedades/modificar/:sociedad', component: ModificarComponent },
];
