package QualityTrans.TecnoQuality.Documentos.Controllers;

import QualityTrans.TecnoQuality.Documentos.DTOs.ArchivoPsicotecnicaRequest;
import QualityTrans.TecnoQuality.Documentos.Entities.ArchivoPsicotecnicaEntity;
import QualityTrans.TecnoQuality.Documentos.Services.ArchivoPsicotecnicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;

@RestController
@RequestMapping("/documentos/psicotecnica")
@CrossOrigin(origins = "*", exposedHeaders = HttpHeaders.CONTENT_DISPOSITION)
public class ArchivoPsicotecnicaController {
    @Autowired
    ArchivoPsicotecnicaService archivoPsicotecnicaService;

    @PostMapping(value= "/subir", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> subirArchivoPsicotecnica(@ModelAttribute ArchivoPsicotecnicaRequest request) {
        try {
            ArchivoPsicotecnicaEntity archivoPsicotecnica = archivoPsicotecnicaService.guardarArchivoPsicotecnica(request.getArchivoPsicotecnica(), request.getIdConductor(), request.getIdUsuario());
            return ResponseEntity.ok("Archivo guardado con ID: " + archivoPsicotecnica.getId());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el archivo");
        }
    }

    @GetMapping("/descargar/{id}")
    public ResponseEntity<byte[]> descargarArchivoPsicotecnica(@PathVariable Long id) {
        ArchivoPsicotecnicaEntity archivoPsicotecnica = archivoPsicotecnicaService.getArchivoPsicotecnicaById(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(archivoPsicotecnica.getTipo()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + archivoPsicotecnica.getIdConductor() + "_psicotecnica_" + LocalDate.now() + ".pdf\"")
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(archivoPsicotecnica.getArchivoPsicotecnico());
    }

    @GetMapping("/comprobarArchivo/{idConductor}/{idUsuario}")
    public ResponseEntity<Boolean> comprobarArchivoPsicotecnica(@PathVariable Long idConductor, @PathVariable Long idUsuario){
        return ResponseEntity.ok(archivoPsicotecnicaService.comprobarArchivoSubido(idConductor, idUsuario));
    }

    @DeleteMapping("/eliminarArchivo/{idConductor}/{idUsuario}")
    public ResponseEntity<String> eliminarArchivo(@PathVariable Long idConductor, @PathVariable Long idUsuario){
        try{
            archivoPsicotecnicaService.eliminarArchivoPsicotecnica(idConductor, idUsuario);
            return ResponseEntity.ok("Archivo eliminado con éxito");
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar archivo");
        }
    }

    @PostMapping(value= "/obtenerQR", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> obtenerQr(@ModelAttribute ArchivoPsicotecnicaRequest request) {
        try {
            InputStream qrStream = request.getArchivoPsicotecnica().getInputStream();
            ArchivoPsicotecnicaEntity archivoPsicotecnica = archivoPsicotecnicaService.buscarArchivoPorIdConductor(request.getIdConductor());
            if (archivoPsicotecnica == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontró un archivo psicotécnico para el conductor con ID: " + request.getIdConductor());
            }
            ResponseEntity.ok(archivoPsicotecnicaService.agregarQR(archivoPsicotecnica, qrStream));
            System.out.println("HOLAS 1");
            return ResponseEntity.ok("Archivo guardado con ID: " + archivoPsicotecnica.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).
                    body("Error al procesar el archivo: " + e.getMessage());
        }
    }
}
