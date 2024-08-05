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
import { authGuard } from './auth.guard';
import { TarifasComponent } from './pages/tarifas/tarifas.component';
import { CommissionsComponent } from './pages/commissions/commissions.component';
import { CommercialsCommissionsTableComponent } from './pages/commercials-commissions-table/commercials-commissions-table.component';
import { SocietyFormComponent } from './pages/society-form/society-form.component';
import { PermissionsBySocietyComponent } from './pages/permissions-by-society/permissions-by-society.component';
import { CommercialFormComponent } from './pages/commercial-form/commercial-form.component';
import { AnulacionesPageComponent } from './pages/anulaciones-page/anulaciones-page.component';

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
        // { path: '', component: ProductOperationsComponent, canActivate: [authGuard] },
        // { path: 'operaciones/:product', component: ProductOperationsComponent, canActivate: [authGuard] }, 
        // { path: 'informes', component: ReportsComponent, canActivate: [authGuard] }, 
        // { path: 'sociedades' , component: SocietyManagerComponent, canActivate: [authGuard] },
        // { path: 'tarifas' , component: TarifasComponent, canActivate: [authGuard] },
        // { path: 'comisiones' , component: CommissionsComponent, canActivate: [authGuard] },
        // { path: 'sociedades/pagos/:codigo', component: PaymentsAndPricesComponent, canActivate: [authGuard] },
        // { path: 'sociedades/productos/:sociedad', component: ProductOperationsComponent },
        // { path: 'sociedades/permisos/:sociedad', component: ProductOperationsComponent },
        // { path: 'sociedades/modificar/:sociedad', component: ProductOperationsComponent },
        // { path: 'gestion-productos' , component: ProductsManagerComponent, canActivate: [authGuard]},
        // { path: 'configurador-productos' , component: ProductConfiguratorComponent, canActivate: [authGuard]},
        // { path: 'configurador-productos/:id' , component: ProductConfiguratorComponent, canActivate: [authGuard]},
        { path: '', component: ProductOperationsComponent,  },
        { path: 'operaciones/:product', component: ProductOperationsComponent, }, 
        { path: 'anulados/:product', component: AnulacionesPageComponent, },
        { path: 'informes', component: ReportsComponent, }, 
        { path: 'sociedades' , component: SocietyManagerComponent,},
        { path: 'tarifas' , component: TarifasComponent,  },
        { path: 'comercial' , component: CommercialFormComponent },
        { path: 'comercial/:comercial' , component: CommercialFormComponent },
        { path: 'comisiones' , component: SocietyManagerComponent },
        { path: 'comisiones/:sociedad' , component: CommissionsComponent},
        { path: 'comisiones-comerciales/:sociedad' , component: CommercialsCommissionsTableComponent},
        { path: 'comisiones-comercial/:comercial' , component: CommissionsComponent},
        { path: 'sociedades/pagos/:sociedad', component: PaymentsAndPricesComponent, },
        { path: 'sociedad', component: SocietyFormComponent },
        { path: 'sociedad/:sociedad', component: SocietyFormComponent },
        { path: 'sociedades/productos/:sociedad', component: PermissionsBySocietyComponent },
        { path: 'sociedades/anexos/:sociedad', component: ProductOperationsComponent },
        { path: 'sociedades/modificar/:sociedad', component: ProductOperationsComponent },
        { path: 'gestion-productos' , component: ProductsManagerComponent, },
        { path: 'configurador-productos' , component: ProductConfiguratorComponent},
        { path: 'configurador-productos/:id' , component: ProductConfiguratorComponent},
    ]
    },
    { path: '**', redirectTo: 'login' },
];
