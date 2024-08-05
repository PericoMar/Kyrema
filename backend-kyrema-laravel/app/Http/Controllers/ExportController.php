<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Pdf\Mpdf as PdfMpdf;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ExportController extends Controller
{

    public function exportExcelToPdf($letrasIdentificacion, Request $request)
    {
        try {
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
                
                // Obtener el contenido existente de la celda
                $contenidoExistente = $sheet->getCell($celda)->getValue();
                
                // Concatenar el contenido existente con el nuevo valor
                $nuevoContenido = $contenidoExistente . ' ' . $valor;
                
                // Establecer el nuevo contenido en la celda
                $sheet->setCellValue($celda, $nuevoContenido);
            }

            foreach ($campos as $campo) {
                $celda = $campo->columna . $campo->fila;
                $sheet->getStyle($celda)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_NONE);
            }

            // Guardar el archivo Excel con los nuevos datos
            $tempExcelPath = storage_path('app/public/temp/plantilla_' . time() . '.xlsx');
            $writer = new Xlsx($spreadsheet);
            $writer->save($tempExcelPath);

            // Convertir el archivo Excel a PDF usando mPDF
            IOFactory::registerWriter('Pdf', PdfMpdf::class);
            $pdfWriter = IOFactory::createWriter($spreadsheet, 'Pdf');
            
            // Guardar el archivo PDF temporalmente
            $tempPdfPath = storage_path('app/public/temp/plantilla_' . time() . '.pdf');
            $pdfWriter->save($tempPdfPath);

            // Devolver el archivo PDF como respuesta HTTP con el tipo de contenido adecuado
            $fileContent = file_get_contents($tempPdfPath);
            $response = response($fileContent, 200)->header('Content-Type', 'application/pdf');

            // Eliminar los archivos temporales
            unlink($tempExcelPath);
            unlink($tempPdfPath); // No eliminamos el PDF temporal

            return $response;

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    // public function exportExcelToPdf($letrasIdentificacion, Request $request)
    // {
    //     try{
    //         // Obtener el tipo de producto basado en las letras de identificación
    //         $tipoProducto = DB::table('tipo_producto')->where('letras_identificacion', $letrasIdentificacion)->first();
            
    //         if (!$tipoProducto) {
    //             return response()->json(['error' => 'Tipo de producto no encontrado'], 404);
    //         }

    //         // Obtener la ruta de la plantilla
    //         $plantillaPath = storage_path('app/public/' . $tipoProducto->plantilla_path);
            
    //         if (!file_exists($plantillaPath)) {
    //             return response()->json(['error' => 'Plantilla no encontrada'], 404);
    //         }

    //         // Cargar el archivo Excel
    //         $spreadsheet = IOFactory::load($plantillaPath);
    //         $sheet = $spreadsheet->getActiveSheet();

    //         // Obtener los campos del tipo de producto con columna y fila no nulos
    //         $campos = DB::table('campos')
    //             ->where('tipo_producto_id', $tipoProducto->id)
    //             ->whereNotNull('columna')
    //             ->whereNotNull('fila')
    //             ->get();

    //         // Obtener el id del request
    //         $id = $request->input('id');
            
    //         // Obtener los valores de los campos de la tabla que se llama igual que las letrasIdentificacion
    //         $valores = DB::table($letrasIdentificacion)->where('id', $id)->first();

    //         if (!$valores) {
    //             return response()->json(['error' => 'Valores no encontrados'], 404);
    //         }

    //         // Rellenar el archivo Excel con los valores obtenidos
    //         foreach ($campos as $campo) {
    //             $celda = $campo->columna . $campo->fila;
    //             // Convertir el nombre del campo a minúsculas y reemplazar espacios por guiones bajos
    //             $nombreCampo = strtolower(str_replace(' ', '_', $campo->nombre));
    //             $valor = $valores->{$nombreCampo}; 
                
    //             // Obtener el contenido existente de la celda
    //             $contenidoExistente = $sheet->getCell($celda)->getValue();
                
    //             // Concatenar el contenido existente con el nuevo valor
    //             $nuevoContenido = $contenidoExistente . ' ' . $valor;
                
    //             // Establecer el nuevo contenido en la celda
    //             $sheet->setCellValue($celda, $nuevoContenido);
                
    //         }

    //         foreach ($campos as $campo) {
    //             $celda = $campo->columna . $campo->fila;
    //             $sheet->getStyle($celda)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_NONE);
    //         }

    //         // Establecer el área de impresión (ajusta las celdas según sea necesario)
    //         $sheet->getPageSetup()->setPrintArea('D1:L54');

    //         // Guardar el archivo Excel con los nuevos datos
    //         $tempExcelPath = storage_path('app/public/temp/plantilla_' . time() . '.xlsx');
    //         $writer = new Xlsx($spreadsheet);
    //         $writer->save($tempExcelPath);

    //         // Convertir el archivo Excel a HTML para generar el PDF
    //         $htmlWriter = IOFactory::createWriter($spreadsheet, 'Html');
    //         ob_start();
    //         $htmlWriter->save('php://output');
    //         $htmlContent = ob_get_clean();

    //         // Eliminar imágenes en base64 del contenido HTML
    //         $htmlContent = $this->removeBase64Images($htmlContent);            

    //         // Añadir estilos CSS al contenido HTML
    //         $htmlContent = $this->adjustHtmlStyles($htmlContent);

    //         // ELIMINAR BORDES QUE SE GENERAN EN EL PDF:
    //         $htmlContent = str_replace('border: 1px solid black;', '', $htmlContent);

    //         // Guardar el contenido HTML en un archivo para revisión
    //         $htmlFilePath = storage_path('app/public/temp/plantilla_' . time() . '.html');
    //         file_put_contents($htmlFilePath, $htmlContent);

            
    //         // Crear el PDF desde el contenido HTML
    //         $pdf = Pdf::loadHTML($htmlContent);

    //         // Guardar el archivo PDF temporalmente
    //         $tempPdfPath = storage_path('app/public/temp/plantilla_' . time() . '.pdf');
    //         $pdf->save($tempPdfPath);
            
    //         // Devolver el archivo PDF como respuesta HTTP con el tipo de contenido adecuado
    //         $fileContent = file_get_contents($tempPdfPath);
    //         $response = response($fileContent, 200)->header('Content-Type', 'application/pdf');

    //         // Eliminar los archivos temporales
    //         unlink($tempExcelPath);
    //         unlink($tempPdfPath);

    //         return $response;

    //     }catch(\Exception $e){

    //         return response()->json(['error' => $e->getMessage()], 500);

    //     }
        
    // }

    // private function adjustHtmlStyles($htmlContent)
    // {
    //     // Reducir espacios en blanco y ajustar el tamaño de la letra
    //     $styles = "
    //         <style>
    //             body {
    //                 font-size: 6px;
    //                 line-height: 1;
    //             }
    //             h1, h2, h3, h4, h5, h6 {
    //                 margin: 2px 0;
    //             }
    //             p {
    //                 margin: 2px 0;
    //             }
    //             table {
    //                 width: 100%;
    //                 border-collapse: collapse;
    //             }
    //             td, th {
    //                 padding: 2px;
    //             }
    //         </style>
    //     ";

    //     // Insertar los estilos en el contenido HTML
    //     $htmlContent = str_replace('</head>', $styles . '</head>', $htmlContent);

    //     return $htmlContent;
    // }

    // private function removeBase64Images($htmlContent)
    // {
    //     // Eliminar todas las imágenes en base64
    //     $htmlContent = preg_replace('/<img[^>]+src="data:image\/[^;]+;base64,([^"]+)"[^>]*>/', '', $htmlContent);
    //     return $htmlContent;
    // }
}
