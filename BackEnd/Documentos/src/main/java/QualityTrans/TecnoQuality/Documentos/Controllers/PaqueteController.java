package QualityTrans.TecnoQuality.Documentos.Controllers;

import QualityTrans.TecnoQuality.Documentos.DTOs.Documentos;
import QualityTrans.TecnoQuality.Documentos.Entities.ArchivoPsicotecnicaEntity;
import QualityTrans.TecnoQuality.Documentos.Entities.CredencialEntity;
import QualityTrans.TecnoQuality.Documentos.Services.ArchivoPsicotecnicaService;
import QualityTrans.TecnoQuality.Documentos.Services.CredencialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/documentos/paquete")
@CrossOrigin(origins = "*", exposedHeaders = HttpHeaders.CONTENT_DISPOSITION)
public class PaqueteController {
    @Autowired
    CredencialService credencialService;
    @Autowired
    ArchivoPsicotecnicaService archivoPsicotecnicaService;

    @GetMapping("/buscarArchivo/{idConductor}")
    public ResponseEntity<Documentos> buscarDocumentosPorIdConductor(@PathVariable Long idConductor){
        CredencialEntity credencial = credencialService.buscarArchivoPorIdConductor(idConductor);
        ArchivoPsicotecnicaEntity psicotecnica = archivoPsicotecnicaService.buscarArchivoPorIdConductor(idConductor);

        if (credencial != null || psicotecnica != null) {
            Documentos documentos = new Documentos();
            documentos.setCredencial(credencial);
            documentos.setPsicotecnica(psicotecnica);
            return ResponseEntity.ok(documentos);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
