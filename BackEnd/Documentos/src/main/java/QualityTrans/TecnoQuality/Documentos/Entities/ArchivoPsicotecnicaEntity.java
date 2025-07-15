package QualityTrans.TecnoQuality.Documentos.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "archivoPsicotecnicos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArchivoPsicotecnicaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;
    private Long idConductor;
    private Long idUsuario; //id de quien subio el archivo
    private LocalDate fechaIngreso;
    private String tipo;
    @Lob
    private byte[] archivoPsicotecnico;
}
