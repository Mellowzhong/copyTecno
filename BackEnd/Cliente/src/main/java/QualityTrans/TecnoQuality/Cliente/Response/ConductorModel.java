package QualityTrans.TecnoQuality.Cliente.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConductorModel {
    String nombre;
    String apellido;
}
