package QualityTrans.TecnoQuality.Cliente.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConductorResponseDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private String email;
    private String telefono;
    private String run;
    private String direccion;
    private String nombre_empresa;
    private LocalDate fechaCreacion;
    private String comuna;
    private String ciudad;
}
