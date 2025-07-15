package QualityTrans.TecnoQuality.Cliente.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
@Table(name = "conductor")
@NoArgsConstructor
@AllArgsConstructor
public class Conductor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private String email;
    @Column(name = "telefono", length = 15, nullable = false)
    private String telefono;
    private String run;
    private String direccion;
    private Long id_empresa; // FK
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDate fechaCreacion;
    private String comuna;
    private String ciudad;
    @Lob
    private byte[] qrImage;
}
