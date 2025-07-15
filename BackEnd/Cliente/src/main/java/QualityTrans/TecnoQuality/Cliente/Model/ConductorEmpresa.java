package QualityTrans.TecnoQuality.Cliente.Model;


import QualityTrans.TecnoQuality.Cliente.DTOs.ConductorDTO;
import QualityTrans.TecnoQuality.Cliente.Entity.Empresa;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConductorEmpresa {

    private ConductorDTO conductor;
    private Empresa empresa;
}
