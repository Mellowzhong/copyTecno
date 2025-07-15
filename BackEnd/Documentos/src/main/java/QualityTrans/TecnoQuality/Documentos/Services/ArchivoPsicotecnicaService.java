package QualityTrans.TecnoQuality.Documentos.Services;

import QualityTrans.TecnoQuality.Documentos.Entities.ArchivoPsicotecnicaEntity;
import QualityTrans.TecnoQuality.Documentos.Repositories.ArchivoPsicotecnicaRepository;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;

@Service
public class ArchivoPsicotecnicaService {

    @Autowired
    ArchivoPsicotecnicaRepository archivoPsicotecnicaRepository;

    public ArchivoPsicotecnicaEntity getArchivoPsicotecnicaById(Long id) {return archivoPsicotecnicaRepository.findById(id).get();}

    public ArchivoPsicotecnicaEntity guardarArchivoPsicotecnica(MultipartFile archivoPsicotecnica, Long idConductor, Long idUsuario) throws IOException {
        if (!archivoPsicotecnica.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Solo se permiten archivos PDF");
        }
        ArchivoPsicotecnicaEntity nuevo = new ArchivoPsicotecnicaEntity();
        nuevo.setIdConductor(idConductor);
        nuevo.setIdUsuario(idUsuario);
        nuevo.setFechaIngreso(LocalDate.now());
        nuevo.setTipo(archivoPsicotecnica.getContentType());
        nuevo.setArchivoPsicotecnico(archivoPsicotecnica.getBytes());
        if(!archivoPsicotecnicaRepository.existsByIdConductorAndIdUsuario(idConductor, idUsuario)){
            return archivoPsicotecnicaRepository.save(nuevo);
        }
        else{
            nuevo.setId(1L);
            return nuevo;
        }
    }

    public Boolean comprobarArchivoSubido(Long idConductor, Long idUsuario) {
        return archivoPsicotecnicaRepository.existsByIdConductorAndIdUsuario(idConductor, idUsuario);
    }

    @Transactional
    public void eliminarArchivoPsicotecnica(Long idConductor, Long idUsuario) {
        System.out.println("Intentando eliminar entidad con idConductor = " + idConductor + ", idUsuario = " + idUsuario);

        try {
            archivoPsicotecnicaRepository.deleteByIdConductorAndIdUsuario(idConductor, idUsuario);
            System.out.println("Entidad eliminada correctamente.");
        } catch (Exception e) {
            System.err.println("Error durante la eliminación:");
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public ArchivoPsicotecnicaEntity buscarArchivoPorIdConductor (Long idConductor) {
        return archivoPsicotecnicaRepository.findByIdConductor(idConductor);
    }

    @Transactional
    public ArchivoPsicotecnicaEntity agregarQR (ArchivoPsicotecnicaEntity archivoPsicotecnica, InputStream imagenQR) throws IOException, DocumentException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        PdfReader reader = new PdfReader(archivoPsicotecnica.getArchivoPsicotecnico());
        PdfStamper stamper = new PdfStamper(reader, outputStream);

        // convierte imagen a objeto itext
        Image qrImage = Image.getInstance(imagenQR.readAllBytes());
        qrImage.setAbsolutePosition(195, 570); // Ajusta la posición según sea necesario
        qrImage.scaleToFit(67, 67);

        //Inserta la imagen en la primera página del PDF
        PdfContentByte content = stamper.getOverContent(1);
        content.addImage(qrImage);

        stamper.close();
        reader.close();

        archivoPsicotecnica.setArchivoPsicotecnico(outputStream.toByteArray());

        return  archivoPsicotecnicaRepository.save(archivoPsicotecnica);
    }
}
