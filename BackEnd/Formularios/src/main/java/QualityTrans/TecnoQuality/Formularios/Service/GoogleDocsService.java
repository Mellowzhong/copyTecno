package QualityTrans.TecnoQuality.Formularios.Service;

import java.io.ByteArrayOutputStream;
import com.google.api.services.docs.v1.Docs;
import com.google.api.services.docs.v1.model.*;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.google.api.services.drive.model.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GoogleDocsService {
    @Autowired
    private Docs docsClient;
    @Autowired
    private Drive driveService;

    public String copiarPlantilla(String templateId, String nuevoNombre) throws IOException {
        File copia = new File().setName(nuevoNombre);
        return driveService.files().copy(templateId, copia).execute().getId();
    }

    public void processDocumentTemplate(String documentId, Map<String, String> replacements) throws IOException {
        List<Request> requests = new ArrayList<>();
        for (Map.Entry<String, String> entry : replacements.entrySet()) {
            SubstringMatchCriteria criteria = new SubstringMatchCriteria()
                    .setText("{{" + entry.getKey() + "}}");
            ReplaceAllTextRequest replaceRequest = new ReplaceAllTextRequest()
                    .setContainsText(criteria)
                    .setReplaceText(entry.getValue());
            requests.add(new Request().setReplaceAllText(replaceRequest));
        }
        BatchUpdateDocumentRequest body = new BatchUpdateDocumentRequest().setRequests(requests);
        docsClient.documents().batchUpdate(documentId, body).execute();
    }

    public byte[] exportarDocumentoComoPdf(String fileId) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        driveService.files().export(fileId, "application/pdf").executeMediaAndDownloadTo(outputStream);
        return outputStream.toByteArray();
    }

    public void eliminarDocumento(String fileId) throws IOException {
        driveService.files().delete(fileId).execute();
    }

//     Metodo opcional para reutilizar el flujo completo
    public byte[] generarYExportarDocumento(String templateId, Map<String, String> replacements) throws IOException {
        String nuevoDocumentoId = copiarPlantilla(templateId, "Documento generado - " + System.currentTimeMillis());
        processDocumentTemplate(nuevoDocumentoId, replacements);
        byte[] pdf = exportarDocumentoComoPdf(nuevoDocumentoId);
        eliminarDocumento(nuevoDocumentoId);
        return pdf;
    }
}
