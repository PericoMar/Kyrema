import { Component, EventEmitter, Output } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; 
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Router, RouterModule } from '@angular/router';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';
import { ComisionButtonsComponent } from './comision-buttons/comision-buttons.component';
import { SocietyService } from '../../../services/society.service';
import { ProductActionButtonsComponent } from '../../../components/product-action-buttons/product-action-buttons.component';


@Component({
  selector: 'app-society-table',
  standalone: true,
  imports: [AgGridAngular, RouterModule],
  templateUrl: './society-table.component.html',
  styleUrl: './society-table.component.css'
})
export class SocietyTableComponent {
  themeClass = "ag-theme-quartz";
  @Output() productSelectedChange: EventEmitter<any> = new EventEmitter<any>();
  params: any;
  
  constructor(private router: Router,
    private societyService: SocietyService,
  ){}


  public columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'nombre', headerName: 'Sociedad', width: 200 },
    { field: 'poblacion', headerName: 'Población', width: 200, flex:1 },
    { field: 'codigo_postal', headerName: 'Cod. Postal', width: 150, flex:1 },
    { field: 'tipo_sociedad', headerName: 'Tipo Sociedad', width: 200,flex:1 },
    {
      headerName: 'Acciones',
      cellRenderer: this.getCellRenderer(this.router.url),
      cellRendererParams: (params: any) => ({
        data: params.data
      }),
      suppressHeaderMenuButton: true,
      sortable: false,
      filter: false,
      flex:2.3,
    } 
  ];

  public rowData: any[] = this.societyService.getSociedadesHijas();
  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };
  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public localeText = {
    // for filter panel
    page: 'Página',
    pageSizeSelectorLabel: 'Tamaño de Página:',
    ariaPageSizeSelectorLabel: 'Page Size',
    more: 'Más',
    to: 'a',
    of: 'de',
    next: 'Siguiente',
    last: 'Último',
    first: 'Primero',
    previous: 'Anterior',
    loadingOoo: 'Cargando...',
  
    // for set filter
    selectAll: 'Seleccionar Todo',
    searchOoo: 'Buscar...',
    blanks: 'En blanco',
  
    // for number filter and text filter
    filterOoo: 'Filtrar...',
    applyFilter: 'Aplicar Filtro...',
    equals: 'Igual a',
    notEqual: 'No Igual a',
  
    // for number filter
    lessThan: 'Menor que',
    greaterThan: 'Mayor que',
    lessThanOrEqual: 'Menor o igual que',
    greaterThanOrEqual: 'Mayor o igual que',
    inRange: 'En rango de',
  
    // for text filter
    contains: 'Contiene',
    notContains: 'No Contiene',
    startsWith: 'Empieza con',
    endsWith: 'Termina con',
  
    // the header of the default group column
    group: 'Grupo',
  
    // tool panel
    columns: 'Columnas',
    rowGroupColumns: 'Columnas de Agrupación',
    rowGroupColumnsEmptyMessage: 'Arrastra las columnas aquí para agrupar',
    valueColumns: 'Columnas de Valor',
    pivotMode: 'Modo Pivote',
  
    // other
    noRowsToShow: 'No hay filas para mostrar',
  
    // enterprise menu
    pinColumn: 'Bloquear Columna',
    valueAggregation: 'Agregación de Valores',
    autosizeThiscolumn: 'Autoajustar esta columna',
    autosizeAllColumns: 'Autoajustar todas las columnas',
    groupBy: 'Agrupar Por',
    ungroupBy: 'Desagrupar Por',
    resetColumns: 'Reiniciar Columnas',
    expandAll: 'Expandir Todo',
    collapseAll: 'Contraer Todo',
    toolPanel: 'Panel de Herramientas',
  
    // panel titles
    filters: 'Filtros',
    groups: 'Grupos',
    values: 'Valores',
    pivots: 'Pivotes',
    toolPanelList: 'Lista de Panel de Herramientas',
  
    // menu
    pinLeft: 'Bloquear a la Izquierda',
    pinRight: 'Bloquear a la Derecha',
    noPin: 'No Bloquear',
    ungroup: 'Desagrupar Por',
    export: 'Exportar',
    csvExport: 'Exportar a CSV',
    excelExport: 'Exportar a Excel',
  };  

  getCellRenderer(route: string) {
    if (route.includes('/sociedades')) {
      return ActionButtonsComponent;
    } else if (route.includes('/comisiones')) {
      return ComisionButtonsComponent;
    } else if(route.includes('/operaciones')){
      return ProductActionButtonsComponent;
    }
    return null; // o cualquier valor por defecto
  }

  // Función para manejar el evento cellDoubleClicked y copiar el valor de la celda al portapapeles
  public onCellDoubleClicked(event: any) {
    const cellValue = event.value; // Obtiene el valor de la celda
    this.copyToClipboard(cellValue); // Copia el valor al portapapeles
  }

  // Función para manejar el evento cellKeyDown y copiar el valor de la celda al portapapeles al presionar Ctrl + C
  public onCellKeyDown(event: any) {
    if (event.event.ctrlKey && event.event.key === 'c') { // Verifica si se presionó Ctrl + C
      const cellValue = event.value; // Obtiene el valor de la celda
      this.copyToClipboard(cellValue); // Copia el valor al portapapeles
    }
  }

  // Función para copiar un valor al portapapeles
  private copyToClipboard(value: any) {
    const dummyTextArea = document.createElement('textarea'); // Crea un elemento de texto oculto
    dummyTextArea.value = value; // Asigna el valor a copiar al elemento de texto
    document.body.appendChild(dummyTextArea); // Agrega el elemento de texto al DOM
    dummyTextArea.select(); // Selecciona el texto en el elemento de texto
    document.execCommand('copy'); // Copia el texto seleccionado al portapapeles
    document.body.removeChild(dummyTextArea); // Elimina el elemento de texto del DOM
  }
  
}