<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ExportController extends Controller
{
    public function exportExcelToPdf($letrasIdentificacion, Request $request)
    {
        try{
            // Obtener el tipo de producto basado en las letras de identificación
            $tipoProducto = DB::table('tipo_producto')->where('letras_identificacion', $letrasIdentificacion)->first();
            
            if (!$tipoProducto) {
                return response()->json(['error' => 'Tipo de producto no encontrado'], 404);
            }

            // Obtener la ruta de la plantilla
            $plantillaPath = storage_path('app/public/' . $tipoProducto->plantilla_path);
            
            if (!file_exists($plantillaPath)) {
                return response()->json(['error' => 'Plantilla no encontrada'], 404);
            }

            // Cargar el archivo Excel
            $spreadsheet = IOFactory::load($plantillaPath);
            $sheet = $spreadsheet->getActiveSheet();

            // Obtener los campos del tipo de producto con columna y fila no nulos
            $campos = DB::table('campos')
                ->where('tipo_producto_id', $tipoProducto->id)
                ->whereNotNull('columna')
                ->whereNotNull('fila')
                ->get();

            // Obtener el id del request
            $id = $request->input('id');
            
            // Obtener los valores de los campos de la tabla que se llama igual que las letrasIdentificacion
            $valores = DB::table($letrasIdentificacion)->where('id', $id)->first();

            if (!$valores) {
                return response()->json(['error' => 'Valores no encontrados'], 404);
            }

            // Rellenar el archivo Excel con los valores obtenidos
            foreach ($campos as $campo) {
                $celda = $campo->columna . $campo->fila;
                // Convertir el nombre del campo a minúsculas y reemplazar espacios por guiones bajos
                $nombreCampo = strtolower(str_replace(' ', '_', $campo->nombre));
                $valor = $valores->{$nombreCampo}; 
                $sheet->setCellValue($celda, $valor);
                
            }

            foreach ($campos as $campo) {
                $celda = $campo->columna . $campo->fila;
                $sheet->getStyle($celda)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_NONE);
            }

            // Guardar el archivo Excel con los nuevos datos
            $tempExcelPath = storage_path('app/public/temp/plantilla_' . time() . '.xlsx');
            $writer = new Xlsx($spreadsheet);
            $writer->save($tempExcelPath);

            // Convertir el archivo Excel a HTML para generar el PDF
            $htmlWriter = IOFactory::createWriter($spreadsheet, 'Html');
            ob_start();
            $htmlWriter->save('php://output');
            $htmlContent = ob_get_clean();


            // ELIMINAR BORDES QUE SE GENERAN EN EL PDF:
            $htmlContent = str_replace('border: 1px solid black;', '', $htmlContent);

            
            // Crear el PDF desde el contenido HTML
            $pdf = Pdf::loadHTML($htmlContent);

            // Guardar el archivo PDF temporalmente
            $tempPdfPath = storage_path('app/public/temp/plantilla_' . time() . '.pdf');
            $pdf->save($tempPdfPath);
            
            // Devolver el archivo PDF como respuesta HTTP con el tipo de contenido adecuado
            $fileContent = file_get_contents($tempPdfPath);
            $response = response($fileContent, 200)->header('Content-Type', 'application/pdf');

            // Eliminar los archivos temporales
            unlink($tempExcelPath);
            unlink($tempPdfPath);

            return $response;

        }catch(\Exception $e){

            return response()->json(['error' => $e->getMessage()], 500);

        }
        
    }
}
