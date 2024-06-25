import { Routes } from '@angular/router';
import { ProductOperationsComponent } from './pages/product-operations/product-operations.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SocietyManagerComponent } from './pages/society-manager/society-manager.component';
import { PaymentsAndPricesComponent } from './pages/payments-and-prices/payments-and-prices.component';
import { ProductsManagerComponent } from './pages/products-manager/products-manager.component';
import { ProductConfiguratorComponent } from './pages/product-configurator/product-configurator.component';
import { LayoutLoginComponent } from './pages/layout-login/layout-login.component';
import { LayoutMainComponent } from './pages/layout-main/layout-main.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LayoutLoginComponent,
        children: [
            { path: '', component: LoginComponent }
        ]
    },
    {
    path: '',
    component: LayoutMainComponent,
    children: [
        { path: '', component: ProductOperationsComponent }, // Ruta vacía dirige al componente HomeComponent
        { path: 'operaciones/:product', component: ProductOperationsComponent }, 
        { path: 'informes', component: ReportsComponent }, 
        { path: 'sociedades' , component: SocietyManagerComponent },
        { path: 'sociedades/pagos/:codigo', component: PaymentsAndPricesComponent },
        // { path: 'sociedades/productos/:sociedad', component: ProductosComponent },
        // { path: 'sociedades/permisos/:sociedad', component: PermisosComponent },
        // { path: 'sociedades/modificar/:sociedad', component: ModificarComponent },
        { path: 'gestion-productos' , component: ProductsManagerComponent},
        { path: 'configurador-productos' , component: ProductConfiguratorComponent},
        { path: 'configurador-productos/:id' , component: ProductConfiguratorComponent},
    ]
    },
    { path: '**', redirectTo: 'login' },
];
