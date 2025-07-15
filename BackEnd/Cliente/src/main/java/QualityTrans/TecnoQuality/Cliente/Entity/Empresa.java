package QualityTrans.TecnoQuality.Cliente.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "empresa")
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private String nombreEmpresa;
    private String rutEmpresa;
    private String giro; //En que se especializa la empresa
    private String direccionEmpresa;
    @Column(name = "telefonoEmpresa", length = 15, nullable = false)
    private String telefonoEmpresa;
    private String emailEmpresa;
    private String comunaEmpresa;
}
