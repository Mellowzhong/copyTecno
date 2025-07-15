package QualityTrans.TecnoQuality.Documentos.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CredencialRequest {
    @NotNull
    private Long idConductor;
    @NotNull
    private Long idUsuario;
    @NotNull
    private MultipartFile archivoCredencial;
}
