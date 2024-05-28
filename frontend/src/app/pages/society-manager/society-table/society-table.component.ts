import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef,ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  createGrid } from 'ag-grid-community'; 
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { RouterModule } from '@angular/router';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';


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
  sociedad : any = {
    nombre : "kyrema"
  }

  public columnDefs: ColDef[] = [
    { field: 'codigo', headerName: 'Código', width: 150 },
    { field: 'sociedad', headerName: 'Sociedad', width: 200 },
    { field: 'poblacion', headerName: 'Población', width: 200 },
    { field: 'codigoPostal', headerName: 'Cod. Postal', width: 150 },
    { field: 'tipoSociedad', headerName: 'Tipo Sociedad', width: 200 },
    {
      headerName: 'Acciones',
      width: 410,
      cellRenderer: ActionButtonsComponent,
      cellRendererParams: (params: any) => ({
        data: params.data
      }),
      suppressMenu: true,
      sortable: false,
      filter: false
    }
  ];

  public rowData: any[] = [
    { codigo: '001', sociedad: 'Sociedad A', poblacion: 'Madrid', codigoPostal: '28001', tipoSociedad: 'S.A.' },
    { codigo: '002', sociedad: 'Sociedad B', poblacion: 'Barcelona', codigoPostal: '08001', tipoSociedad: 'S.L.' },
    { codigo: '003', sociedad: 'Sociedad C', poblacion: 'Valencia', codigoPostal: '46001', tipoSociedad: 'Cooperativa' },
    // Agrega más datos aquí
  ];
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