import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ClientSideRowModelModule, RowClassRules } from "ag-grid-community";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  createGrid,
} from "ag-grid-community";


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [AgGridAngular, AgGridModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})

export class TableComponent implements OnChanges{
  themeClass = "ag-theme-quartz";
  @Output() productSelectedChange: EventEmitter<any> = new EventEmitter<any>();
  public productSelected: any;

  @Input() rowData!: any[] | null;
  @Input() columnDefs!: ColDef[]; 
  @Input() gridOptions!: GridOptions;
  @Input() rowClassRules!: RowClassRules;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };
  public rowSelection: "single" | "multiple" = "multiple";
  @Input() paginationPageSize = 10;
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

  @Input() loadingRows! : boolean;
  private gridApi!: GridApi<any>;
  private gridColumnApi: any;

  // @Output() pageChanged = new EventEmitter<number>();

  // onPageChange(event: any) {
  //   console.log('Page changed:', event.newPage);
  //   this.pageChanged.emit();  // Emitir el número de página
  // }
  
  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // Verificar si el valor de 'loadingRows' ha cambiado
    if (changes['loadingRows']) {
      console.log('loadingRows changed:', this.loadingRows);
      this.setLoadingRows(this.loadingRows);
    }

    console.log('gridOptions changed:', this.gridOptions);
    const today = new Date();

    this.rowClassRules = {
      // apply green to 2008
      'rag-green-outer': (params) => { 
        const fechaDeEmision = new Date(params.data.fecha_de_emisión);
        return fechaDeEmision.getFullYear() === today.getFullYear() &&
               fechaDeEmision.getMonth() === today.getMonth() &&
               fechaDeEmision.getDate() === today.getDate(); 
      },
  
      // apply amber 2004
      'rag-amber-outer': (params) => { return new Date(params.data.fecha_de_fin).getTime() < today.getTime(); },
  
      // apply red to 2000
      'rag-red-outer': (params) => { return params.data.year === 2000; }
    };  
  }

  public onRowClicked(event: any) {
    this.productSelected = event.data; // Actualiza productSelected con los datos de la fila
    this.productSelectedChange.emit(this.productSelected);
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

  setLoadingRows(isLoading: boolean) {
    if(isLoading && this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }
  }

  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
    console.log('gridOptions changed:', this.gridOptions);
  }

  clearAllFilters() {
    this.gridApi.setFilterModel(null);
  }

  
}
