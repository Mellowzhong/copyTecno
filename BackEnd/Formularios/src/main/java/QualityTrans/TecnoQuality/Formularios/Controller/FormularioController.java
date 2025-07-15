package QualityTrans.TecnoQuality.Formularios.Controller;

import QualityTrans.TecnoQuality.Formularios.Entity.Formulario;
import QualityTrans.TecnoQuality.Formularios.Model.ArchivoPsicotecnicaEntity;
import QualityTrans.TecnoQuality.Formularios.Model.Conductor;
import QualityTrans.TecnoQuality.Formularios.Model.Paquete;
import QualityTrans.TecnoQuality.Formularios.Service.FormularioService;
import QualityTrans.TecnoQuality.Formularios.Service.GoogleDocsService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.DocumentException;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/Formulario")
public class FormularioController {

    @Autowired
    private GoogleDocsService docsService;

    @Autowired
    private FormularioService formularioService;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/generate/psyco2")
    public ResponseEntity<?> generarDocumentoPsicologo(@RequestBody Paquete paquete) {
        try {
            // 1. Generar y exportar el PDF
            byte[] pdf = docsService.generarYExportarDocumento(
                    "1Jx1u9vLi60c1J3mgefl9KfbR-cpcwB_pEUcD3U5YKjE",
                    paquete.getParametros()
            );

            // 2. Guardar en la base de datos con idUsuario e idCliente
            Formulario formulario = formularioService.guardarFormularioConPdf(
                    pdf,
                    "Documento psicologico",
                    paquete.getIdUsuario(),
                    paquete.getIdCliente()
            );
            
            // 3. Devolver el PDF
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .body(pdf);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping(value = "/generate/medic2", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> generarDocumentoMedico(
            @RequestPart("parametros") String parametrosJson,
            @RequestParam("idCliente") Long idCliente,
            @RequestParam("idUsuario") Long idUsuario,
            @RequestPart("imagen") MultipartFile imagen
    ) {
        try {
            // Deserializar parametros
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> parametros = mapper.readValue(parametrosJson, new TypeReference<>(){});

            // 1. Generar y exportar el PDF
            byte[] pdf = docsService.generarYExportarDocumento(
                    "1QixKx9aHN_Rm5lCsZwGW5cxwx-0IgbZhXkE4GRG9d5w",
                    parametros
            );

            // 2. Stampar la firma en el PDF
            pdf = formularioService.stamparFirmaMedico(pdf, imagen.getInputStream());

            // 3. Guardar en la base de datos con idUsuario e idCliente
            Formulario formulario = formularioService.guardarFormularioConPdf(
                    pdf,
                    "Documento Medico",
                    idUsuario,
                    idCliente
            );

            // 4. Devolver el PDF
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .body(pdf);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
    }


    @GetMapping("/zip/{idCliente}")
    public ResponseEntity<StreamingResponseBody> generarZipParaCliente(@CookieValue(name = "JWT")String JWT, @PathVariable Long idCliente) {
        if (JWT == null || JWT.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {

            StreamingResponseBody stream = formularioService.generarZipStreamPorIdCliente(JWT, idCliente);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/zip")
                    .header("Content-Disposition",
                            "attachment; filename=\"documentos_cliente_"
                                    + ".zip\"")
                    .body(stream);
        } catch (Exception e) {
            e.printStackTrace(); // ¡Agrega esto para ver el error en los logs!
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/comprobarFormulario/{idCliente}/{idUsuario}")
    public ResponseEntity<Boolean> comprobarFormulario(@PathVariable Long idCliente, @PathVariable Long idUsuario){
        return ResponseEntity.ok(formularioService.comprobarFormularioSubido(idCliente, idUsuario));
    }
    @DeleteMapping("/eliminarArchivo/{idCliente}/{idUsuario}")
    public ResponseEntity<String> eliminarFormulario(@PathVariable Long idCliente, @PathVariable Long idUsuario){
        try{
            formularioService.eliminarArchivoFormulario(idCliente, idUsuario);
            return ResponseEntity.ok("Archivo eliminado con éxito");
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar archivo");
        }
    }

    @GetMapping("/buscarDocumento/{idCliente}")
    public ResponseEntity<byte[]> buscarDocumentoPorIdCliente(@CookieValue(name = "JWT")String JWT, @PathVariable Long idCliente) {
        // Validar el token JWT
        if (JWT == null || JWT.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // Obtener Documento del cliente
        ArchivoPsicotecnicaEntity archivo = formularioService.buscarDocumentoPorIdCliente(JWT, idCliente);
        if (archivo == null || archivo.getArchivoPsicotecnico() == null) {
            return ResponseEntity.notFound().build();
        }
        //Descargar el documento
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(archivo.getTipo()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + archivo.getIdConductor() + "_credencial_" + LocalDate.now() + ".pdf\"")
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(archivo.getArchivoPsicotecnico());
    }

    @PostMapping(value = "/generate/medic", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> generarDocumentoMedico2(
            @RequestPart("parametros") String parametrosJson,
            @RequestParam("idCliente") Long idCliente,
            @RequestParam("idUsuario") Long idUsuario,
            @RequestPart("imagen") MultipartFile imagen
    ) throws Exception {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> parametros = mapper.readValue(parametrosJson, new TypeReference<>(){});

            //Cargar la plantilla de Word
            InputStream plantilla = getClass().getResourceAsStream("/Formulario_Medico.docx");
            XWPFDocument document = new XWPFDocument(plantilla);

            //remplazar los marcadores en el documento
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                formularioService.reemplazarTextoEnParrafo(paragraph, parametros);
            }

            //remplazar los marcadores en las tablas
            for (XWPFTable table : document.getTables()) {
                for (XWPFTableRow row : table.getRows()) {
                    for (XWPFTableCell cell : row.getTableCells()) {
                        for (XWPFParagraph paragraph : cell.getParagraphs()) {
                            formularioService.reemplazarTextoEnParrafo(paragraph, parametros);
                        }
                    }
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.write(outputStream);
            byte[] archivo  = outputStream.toByteArray();

            // 1. Guardar DOCX temporalmente
            File tempDocx = File.createTempFile("formulario_", ".docx");
            try (FileOutputStream fos = new FileOutputStream(tempDocx)) {
                fos.write(archivo); // 'archivo' es el byte[] generado por Apache POI
            }

            // 2. Convertir a PDF
            byte[] pdfBytes = formularioService.convertirDocxAPdf(tempDocx);

//            // 2. Stampar la firma en el PDF
//            pdfBytes = formularioService.stamparFirmaMedico(pdfBytes, imagen.getInputStream());

            // 3. Guardar PDF si quieres
            formularioService.guardarFormularioConPdf(pdfBytes, "Documento Medico", idUsuario, idCliente);

            // 4. Devolver como respuesta
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=documento.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new ByteArrayResource(pdfBytes));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al generar el documento: " + e.getMessage());
        }
    }

    @PostMapping("/generate/psyco")
    public ResponseEntity<?> generarDocumentoPsicologo2(@RequestBody Paquete paquete) {
        try {

            //Cargar la plantilla de Word
            InputStream plantilla = getClass().getResourceAsStream("/Formulario_Psicologo.docx");
            XWPFDocument document = new XWPFDocument(plantilla);

            //remplazar los marcadores en el documento
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                formularioService.reemplazarTextoEnParrafo(paragraph, paquete.getParametros());
            }

            //remplazar los marcadores en las tablas
            for (XWPFTable table : document.getTables()) {
                for (XWPFTableRow row : table.getRows()) {
                    for (XWPFTableCell cell : row.getTableCells()) {
                        for (XWPFParagraph paragraph : cell.getParagraphs()) {
                            formularioService.reemplazarTextoEnParrafo(paragraph, paquete.getParametros());
                        }
                    }
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.write(outputStream);
            byte[] archivo  = outputStream.toByteArray();

            // 1. Guardar DOCX temporalmente
            File tempDocx = File.createTempFile("formulario_", ".docx");
            try (FileOutputStream fos = new FileOutputStream(tempDocx)) {
                fos.write(archivo); // 'archivo' es el byte[] generado por Apache POI
            }

            // 2. Convertir a PDF
            byte[] pdfBytes = formularioService.convertirDocxAPdf(tempDocx);

            // 3. Guardar PDF si quieres
            formularioService.guardarFormularioConPdf(pdfBytes, "Documento psicologico", paquete.getIdUsuario(), paquete.getIdCliente());

            // 4. Devolver como respuesta
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=documento.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new ByteArrayResource(pdfBytes));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al generar el documento: " + e.getMessage());
        }
    }

}
