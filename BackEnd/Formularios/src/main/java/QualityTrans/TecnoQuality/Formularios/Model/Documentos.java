package QualityTrans.TecnoQuality.Formularios.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Documentos {
    @NonNull
    private ArchivoPsicotecnicaEntity psicotecnica;
    @NonNull
    private CredencialEntity credencial;
}
