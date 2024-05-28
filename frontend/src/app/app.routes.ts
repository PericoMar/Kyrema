import { Routes } from '@angular/router';
import { ProductOperationsComponent } from './pages/product-operations/product-operations.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SocietyManagerComponent } from './pages/society-manager/society-manager.component';
import { PaymentsAndPricesComponent } from './pages/payments-and-prices/payments-and-prices.component';

export const routes: Routes = [
    { path: '', component: ProductOperationsComponent }, // Ruta vacía dirige al componente HomeComponent
    { path: 'operaciones/:product', component: ProductOperationsComponent }, 
    { path: 'informes', component: ReportsComponent }, 
    { path: 'sociedades' , component: SocietyManagerComponent },
    { path: 'sociedades/pagos/:codigo', component: PaymentsAndPricesComponent },
    // { path: 'sociedades/productos/:sociedad', component: ProductosComponent },
    // { path: 'sociedades/permisos/:sociedad', component: PermisosComponent },
    // { path: 'sociedades/modificar/:sociedad', component: ModificarComponent },
];
