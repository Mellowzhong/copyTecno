package QualityTrans.TecnoQuality.Usuarios.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "usuarios")
@NoArgsConstructor
@AllArgsConstructor
public class Usuarios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;
    private String nombre;
    private String rut;
    private String apellido;
    private String email;
    private String password;
    private int rol; //(1.-Admin, 2.-Secretaria, 3.-Medico, 4.- Psicologo, 5.-Psicotecnico, 6.-Prueba)
    private String localidad;
}
