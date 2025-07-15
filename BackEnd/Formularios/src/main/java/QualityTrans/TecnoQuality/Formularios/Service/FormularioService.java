package QualityTrans.TecnoQuality.Formularios.Service;

import QualityTrans.TecnoQuality.Formularios.Entity.Formulario;
import QualityTrans.TecnoQuality.Formularios.Model.ArchivoPsicotecnicaEntity;
import QualityTrans.TecnoQuality.Formularios.Model.CredencialEntity;
import QualityTrans.TecnoQuality.Formularios.Model.Documentos;
import QualityTrans.TecnoQuality.Formularios.Repository.FormularioRepository;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.*;
import jakarta.transaction.Transactional;
import org.apache.coyote.Response;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;


import java.io.*;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Transactional
@Service
public class FormularioService {

    @Autowired
    private FormularioRepository formularioRepository;
    @Autowired
    private RestTemplate restTemplate;

    public Formulario guardarFormularioConPdf(byte[] pdf, String nombreDocumento, Long idUsuario, Long idCliente) {
        Formulario formulario = new Formulario();
        formulario.setNombreDocumento(nombreDocumento);
        formulario.setFechaCreacion(LocalDateTime.now());
        formulario.setDocumentoPdf(pdf);
        formulario.setIdUsuario(idUsuario);
        formulario.setIdCliente(idCliente);
        return formularioRepository.save(formulario);
    }

    // FormularioService.java
    public  List<Formulario> findByIdCliente(Long id) {
        return formularioRepository.findByIdCliente(id);
    }

    public StreamingResponseBody generarZipStreamPorIdCliente(String jwtToken, Long idCliente) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + jwtToken);

        HttpEntity<String> request = new HttpEntity<String>(headers);

        ResponseEntity<Documentos> response =
                restTemplate.exchange("http://localhost:8083/documentos/paquete/buscarArchivo/" + idCliente, HttpMethod.GET, request, Documentos.class);
        Documentos documentos = response.getBody();

        List<Formulario> formularios = formularioRepository.findByIdCliente(idCliente);

        if (formularios.isEmpty()) {
            throw new RuntimeException("No se encontraron documentos");
        }
        return outputStream -> {
            try (ZipOutputStream zos = new ZipOutputStream(outputStream)) {
                for (Formulario formulario : formularios) {
                    if (formulario.getDocumentoPdf() != null) {
                        ZipEntry entry = new ZipEntry(formulario.getNombreDocumento() + ".pdf");
                        zos.putNextEntry(entry);
                        zos.write(formulario.getDocumentoPdf());
                        zos.closeEntry();
                    }
                }
                ZipEntry entry = new ZipEntry("Psicotecnico" + ".pdf");
                zos.putNextEntry(entry);
                zos.write(documentos.getPsicotecnica().getArchivoPsicotecnico());
                zos.closeEntry();

                ZipEntry entry2 = new ZipEntry("Credencial" + ".pdf");
                zos.putNextEntry(entry2);
                zos.write(documentos.getCredencial().getArchivoCredencial());
                zos.closeEntry();
            }
        };
    }
    public Boolean comprobarFormularioSubido(Long idCliente, Long idUsuario) {
        return formularioRepository.existsByIdClienteAndIdUsuario(idCliente, idUsuario);
    }
    @Transactional
    public void eliminarArchivoFormulario(Long idCliente, Long idUsuario) {
        System.out.println("Intentando eliminar entidad con idCliente = " + idCliente + ", idUsuario = " + idUsuario);

        try {
            formularioRepository.deleteByIdClienteAndIdUsuario(idCliente, idUsuario);
            System.out.println("Archivo eliminado correctamente.");
        } catch (Exception e) {
            System.err.println("Error durante la eliminación:");
            e.printStackTrace();
            throw e;
        }
    }



    public ArchivoPsicotecnicaEntity buscarDocumentoPorIdCliente (String jwtToken, Long idCliente) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + jwtToken);

        HttpEntity<String> request = new HttpEntity<String>(headers);

        ResponseEntity<ArchivoPsicotecnicaEntity> response =
                restTemplate.exchange("http://localhost:8083/documentos/psicotecnica/buscarArchivo/" + idCliente, HttpMethod.GET, request, ArchivoPsicotecnicaEntity.class);

        return response.getBody();
    }

    public byte[] stamparFirmaPsicologo(byte[] pdf, InputStream firma) throws IOException, DocumentException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        PdfReader reader = new PdfReader(pdf);
        PdfStamper stamper = new PdfStamper(reader, outputStream);

        // Convierte imagena objeto itext
        Image qrImage = Image.getInstance(firma.readAllBytes());
        qrImage.setAbsolutePosition(183, 241);
        qrImage.scaleToFit(50, 50);

        // Inserta la imagen en la primera página del PDF
        int ultimaPagina = reader.getNumberOfPages();
        PdfContentByte content = stamper.getOverContent(ultimaPagina);
        content.addImage(qrImage);

        stamper.close();
        reader.close();

        return outputStream.toByteArray();
    };

    public byte[] stamparFirmaMedico(byte[] pdf, InputStream firma) throws IOException, DocumentException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        PdfReader reader = new PdfReader(pdf);
        PdfStamper stamper = new PdfStamper(reader, outputStream);

        // Convierte imagena objeto itext
        Image qrImage = Image.getInstance(firma.readAllBytes());
        qrImage.setAbsolutePosition(284, 45);
        qrImage.scaleToFit(50, 50);

        // Inserta la imagen en la primera página del PDF
        int ultimaPagina = reader.getNumberOfPages();
        PdfContentByte content = stamper.getOverContent(ultimaPagina);
        content.addImage(qrImage);

        stamper.close();
        reader.close();

        return outputStream.toByteArray();
    }

    public void reemplazarTextoEnParrafo(XWPFParagraph paragraph, Map<String, String> replacements) throws IOException {
        for (XWPFRun run : paragraph.getRuns()) {
            String texto = run.getText(0);
            if (texto != null) {
                for (Map.Entry<String, String> entry : replacements.entrySet()) {
                    texto = texto.replace( "{{"+entry.getKey()+"}}", entry.getValue());
                }
                run.setText(texto, 0);
            }
        }
    }

    public byte[] convertirDocxAPdf(File docxFile) throws IOException, InterruptedException {
        File outputDir = docxFile.getParentFile();

        ProcessBuilder pb = new ProcessBuilder(
                "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
                "--headless",
                "--convert-to", "pdf",
                "--outdir", outputDir.getAbsolutePath(),
                docxFile.getAbsolutePath()
        );
        pb.redirectErrorStream(true);
        Process process = pb.start();

        // Espera a que termine la conversión
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new IOException("Error al convertir DOCX a PDF (exit code " + exitCode + ")");
        }

        // Leer el archivo PDF resultante
        String pdfFileName = docxFile.getName().replace(".docx", ".pdf");
        File pdfFile = new File(outputDir, pdfFileName);
        byte[] pdfBytes = Files.readAllBytes(pdfFile.toPath());

        // Limpiar archivos temporales
        docxFile.delete();
        pdfFile.delete();

        return pdfBytes;
    }
}
