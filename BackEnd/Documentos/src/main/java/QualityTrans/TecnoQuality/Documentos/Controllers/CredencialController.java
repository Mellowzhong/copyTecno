package QualityTrans.TecnoQuality.Documentos.Controllers;

import QualityTrans.TecnoQuality.Documentos.DTOs.CredencialRequest;
import QualityTrans.TecnoQuality.Documentos.Entities.ArchivoPsicotecnicaEntity;
import QualityTrans.TecnoQuality.Documentos.Entities.CredencialEntity;
import QualityTrans.TecnoQuality.Documentos.Services.CredencialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/documentos/credenciales")
@CrossOrigin(origins = "*", exposedHeaders = HttpHeaders.CONTENT_DISPOSITION)
public class CredencialController {
    @Autowired
    CredencialService credencialService;

    @PostMapping(value= "/subir", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> subirCredencial(@ModelAttribute CredencialRequest request) {
        try {
            CredencialEntity credencial = credencialService.guardarCredencial(request.getArchivoCredencial(), request.getIdConductor(), request.getIdUsuario());
            return ResponseEntity.ok("Archivo guardado con ID: " + credencial.getId());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el archivo");
        }
    }

    @GetMapping("/descargar/{id}")
    public ResponseEntity<byte[]> descargarArchivo(@PathVariable Long id) {
        CredencialEntity credencial = credencialService.getCredencialById(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(credencial.getTipo()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + credencial.getIdConductor() + "_credencial_" + LocalDate.now() + ".pdf\"")
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(credencial.getArchivoCredencial());
    }

    @GetMapping("/comprobarArchivo/{idConductor}/{idUsuario}")
    public ResponseEntity<Boolean> comprobarArchivoCredencial(@PathVariable Long idConductor, @PathVariable Long idUsuario){
        return ResponseEntity.ok(credencialService.comprobarArchivoSubido(idConductor, idUsuario));
    }

    @DeleteMapping("/eliminarArchivo/{idConductor}/{idUsuario}")
    public ResponseEntity<String> eliminarArchivo(@PathVariable Long idConductor, @PathVariable Long idUsuario){
        try{
            credencialService.eliminarArchivoCredencial(idConductor, idUsuario);
            return ResponseEntity.ok("Archivo eliminado con éxito");
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar archivo");
        }
    }

}
