import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getMatFormFieldPlaceholderConflictError } from '@angular/material/form-field';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef,ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  createGrid } from 'ag-grid-community'; 
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [AgGridAngular, AgGridModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  themeClass = "ag-theme-quartz";
  @Input() products!: Array<any>;
  @Output() productSelectedChange: EventEmitter<any> = new EventEmitter<any>();
  public productSelected: any;

  public rowData: any[] | null = [
    {
      make: "Tesla",
      model: "Model Y",
      price: 64950,
      electric: true,
      month: "June",
    },
    {
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
      month: "October",
    },
    {
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
      month: "August",
    },
    {
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
      month: "February",
    },
    {
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
      month: "January",
    },
    {
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
      month: "March",
    },
    {
      make: "Vauxhall",
      model: "Corsa",
      price: 18460,
      electric: false,
      month: "July",
    },
    {
      make: "Volvo",
      model: "EX30",
      price: 33795,
      electric: true,
      month: "September",
    },
    {
      make: "Mercedes",
      model: "Maybach",
      price: 175720,
      electric: false,
      month: "December",
    },
    {
      make: "Vauxhall",
      model: "Astra",
      price: 25795,
      electric: false,
      month: "April",
    },
    {
      make: "Fiat",
      model: "Panda",
      price: 13724,
      electric: false,
      month: "November",
    },
    {
      make: "Jaguar",
      model: "I-PACE",
      price: 69425,
      electric: true,
      month: "May",
    },
    {
      make: "Tesla",
      model: "Model Y",
      price: 64950,
      electric: true,
      month: "June",
    },
    {
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
      month: "October",
    },
    {
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
      month: "August",
    },
    {
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
      month: "February",
    },
    {
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
      month: "January",
    },
    {
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
      month: "March",
    },
    {
      make: "Vauxhall",
      model: "Corsa",
      price: 18460,
      electric: false,
      month: "July",
    },
    {
      make: "Volvo",
      model: "EX30",
      price: 33795,
      electric: true,
      month: "September",
    },
    {
      make: "Mercedes",
      model: "Maybach",
      price: 175720,
      electric: false,
      month: "December",
    },
    {
      make: "Vauxhall",
      model: "Astra",
      price: 25795,
      electric: false,
      month: "April",
    },
    {
      make: "Fiat",
      model: "Panda",
      price: 13724,
      electric: false,
      month: "November",
    },
    {
      make: "Jaguar",
      model: "I-PACE",
      price: 69425,
      electric: true,
      month: "May",
    },
    {
      make: "Tesla",
      model: "Model Y",
      price: 64950,
      electric: true,
      month: "June",
    },
    {
      make: "Ford",
      model: "F-Series",
      price: 33850,
      electric: false,
      month: "October",
    },
    {
      make: "Toyota",
      model: "Corolla",
      price: 29600,
      electric: false,
      month: "August",
    },
    {
      make: "Mercedes",
      model: "EQA",
      price: 48890,
      electric: true,
      month: "February",
    },
    {
      make: "Fiat",
      model: "500",
      price: 15774,
      electric: false,
      month: "January",
    },
    {
      make: "Nissan",
      model: "Juke",
      price: 20675,
      electric: false,
      month: "March",
    },
    {
      make: "Vauxhall",
      model: "Corsa",
      price: 18460,
      electric: false,
      month: "July",
    },
    {
      make: "Volvo",
      model: "EX30",
      price: 33795,
      electric: true,
      month: "September",
    },
    {
      make: "Mercedes",
      model: "Maybach",
      price: 175720,
      electric: false,
      month: "December",
    },
    {
      make: "Vauxhall",
      model: "Astra",
      price: 25795,
      electric: false,
      month: "April",
    },
    {
      make: "Fiat",
      model: "Panda",
      price: 13724,
      electric: false,
      month: "November",
    },
    {
      make: "Jaguar",
      model: "I-PACE",
      price: 69425,
      electric: true,
      month: "May",
    },
  ];
  public columnDefs: ColDef[] = [
    {
      field: "make",
      cellEditor: 'agTextCellEditor',
      flex : 1,
    },
    { field: "model",
      flex : 1,
    },
    { field: "price",
      flex : 1,
    },
    { field: "electric",
      flex : 1,
    },
    {
      field: "month",
      comparator: (valueA, valueB) => {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const idxA = months.indexOf(valueA);
        const idxB = months.indexOf(valueB);
        return idxA - idxB;
      },
      flex : 1,
    },
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

  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }
  
}
