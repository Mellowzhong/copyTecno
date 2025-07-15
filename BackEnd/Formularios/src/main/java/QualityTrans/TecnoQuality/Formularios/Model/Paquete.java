package QualityTrans.TecnoQuality.Formularios.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paquete {

    private Map<String,String> parametros;
    private Long idCliente;
    private Long idUsuario;
    private MultipartFile imagen;
}
