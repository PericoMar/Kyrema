import { Routes } from '@angular/router';
import { ProductOperationsComponent } from './pages/product-operations/product-operations.component';
import { ReportsComponent } from './pages/reports/reports.component';

export const routes: Routes = [
    { path: '', component: ProductOperationsComponent }, // Ruta vacía dirige al componente HomeComponent
    { path: 'operaciones/:product', component: ProductOperationsComponent }, 
    { path: 'informes', component: ReportsComponent }, 
];
