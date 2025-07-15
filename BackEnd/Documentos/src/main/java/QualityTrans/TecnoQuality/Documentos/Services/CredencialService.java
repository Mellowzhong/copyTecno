package QualityTrans.TecnoQuality.Documentos.Services;

import QualityTrans.TecnoQuality.Documentos.Entities.ArchivoPsicotecnicaEntity;
import QualityTrans.TecnoQuality.Documentos.Entities.CredencialEntity;
import QualityTrans.TecnoQuality.Documentos.Repositories.CredencialRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

@Service
public class CredencialService {

    @Autowired
    CredencialRepository credencialRepository;

    public CredencialEntity getCredencialById(Long id) {return credencialRepository.findById(id).get();}

    public CredencialEntity guardarCredencial(MultipartFile archivoCredencial, Long idConductor, Long idUsuario) throws IOException {
        if (!archivoCredencial.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Solo se permiten archivos PDF");
        }

        CredencialEntity nuevo = new CredencialEntity();
        nuevo.setIdConductor(idConductor);
        nuevo.setIdUsuario(idUsuario);
        nuevo.setFechaIngreso(LocalDate.now());
        nuevo.setTipo(archivoCredencial.getContentType());
        nuevo.setArchivoCredencial(archivoCredencial.getBytes());
        if(!credencialRepository.existsByIdConductorAndIdUsuario(idConductor, idUsuario)){
            return credencialRepository.save(nuevo);
        }
        else{
            nuevo.setId(1L);
            return nuevo;
        }
    }

    public Boolean comprobarArchivoSubido(Long idConductor, Long idUsuario){
        return credencialRepository.existsByIdConductorAndIdUsuario(idConductor, idUsuario);
    }

    @Transactional
    public void eliminarArchivoCredencial(Long idConductor, Long idUsuario) {
        System.out.println("Intentando eliminar entidad con idConductor = " + idConductor + ", idUsuario = " + idUsuario);

        try {
            credencialRepository.deleteByIdConductorAndIdUsuario(idConductor, idUsuario);
            System.out.println("Entidad eliminada correctamente.");
        } catch (Exception e) {
            System.err.println("Error durante la eliminación:");
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public CredencialEntity buscarArchivoPorIdConductor (Long idConductor) {
        return credencialRepository.findByIdConductor(idConductor);
    }
}
