package QualityTrans.TecnoQuality.Formularios.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conductor {
    private Long id;
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private String email;
    private String telefono;
    private String run;
    private String direccion;
    private Long id_empresa; // ¡Mismo nombre que en la entidad Conductor!
    private LocalDate fechaCreacion;
}

