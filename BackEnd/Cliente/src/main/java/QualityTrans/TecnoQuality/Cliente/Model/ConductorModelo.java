package QualityTrans.TecnoQuality.Cliente.Model;


import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConductorModelo {

    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private String email;
    @Column(name = "telefono", length = 15, nullable = false)
    private String telefono;
    private String run;
    private String direccion;
    private String nombre_empresa; // FK
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDate fechaCreacion;
    private String comuna;
    private String ciudad;

}
