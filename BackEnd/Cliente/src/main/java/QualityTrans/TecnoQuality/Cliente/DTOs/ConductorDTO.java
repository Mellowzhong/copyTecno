package QualityTrans.TecnoQuality.Cliente.DTOs;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConductorDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private String email;
    private String telefono;
    private String run;
    private String direccion;
    private Long id_empresa;
    private LocalDate fechaCreacion;
    private String comuna;
    private String ciudad;
}
