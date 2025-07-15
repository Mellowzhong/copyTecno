package QualityTrans.TecnoQuality.Formularios.Model;

import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CredencialEntity {

    private Long id;
    private Long idConductor;
    private Long idUsuario; // id de quien subió el archivo
    private String fechaIngreso; // Cambiado a String para simplificar
    private String tipo;
    @Lob
    private byte[] archivoCredencial; // Mantener como byte[] para almacenar el archivo
}
