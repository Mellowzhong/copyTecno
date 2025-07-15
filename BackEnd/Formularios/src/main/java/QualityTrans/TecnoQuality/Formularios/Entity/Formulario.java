package QualityTrans.TecnoQuality.Formularios.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "formulario")
@NoArgsConstructor
@AllArgsConstructor
public class Formulario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombreDocumento;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @Lob // Para PostgreSQL, usa @Lob y byte[]
    @Column(nullable = false)
    private byte[] documentoPdf;

    private Long idUsuario;
    private Long idCliente;
}
