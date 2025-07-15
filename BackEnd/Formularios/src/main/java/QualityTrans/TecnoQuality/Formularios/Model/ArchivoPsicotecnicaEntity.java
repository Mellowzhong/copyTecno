package QualityTrans.TecnoQuality.Formularios.Model;

import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArchivoPsicotecnicaEntity {

    private Long id;
    private Long idConductor;
    private Long idUsuario; // id de quien subió el archivo
    private String fechaIngreso; // Cambiado a String para evitar problemas de serialización
    private String tipo;
    @Lob
    private byte[] archivoPsicotecnico;
}
