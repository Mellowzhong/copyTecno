package QualityTrans.TecnoQuality.Documentos.Services;

import QualityTrans.TecnoQuality.Documentos.Entities.ArchivoPsicotecnicaEntity;
import QualityTrans.TecnoQuality.Documentos.Repositories.ArchivoPsicotecnicaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class ArchivoPsicotecnicaServiceTest {

    private ArchivoPsicotecnicaRepository archivoPsicotecnicaRepository;
    private ArchivoPsicotecnicaService archivoPsicotecnicaService;

    @BeforeEach
    void setUp() {
        archivoPsicotecnicaRepository = mock(ArchivoPsicotecnicaRepository.class);
        archivoPsicotecnicaService = new ArchivoPsicotecnicaService();
        archivoPsicotecnicaService.archivoPsicotecnicaRepository = archivoPsicotecnicaRepository;
    }

    @Test
    void guardarArchivoPsicotecnica_deberiaGuardarArchivoPDFCorrectamente() throws IOException {
        // Arrange
        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "psicotecnico.pdf", "application/pdf", "datos de prueba".getBytes()
        );

        when(archivoPsicotecnicaRepository.save(any(ArchivoPsicotecnicaEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        ArchivoPsicotecnicaEntity guardado = archivoPsicotecnicaService.guardarArchivoPsicotecnica(archivo, 1L, 1L);

        // Assert
        assertEquals(1L, guardado.getIdConductor());
        assertEquals(1L, guardado.getIdUsuario());
        assertEquals("application/pdf", guardado.getTipo());
        assertNotNull(guardado.getArchivoPsicotecnico());
        assertEquals(LocalDate.now(), guardado.getFechaIngreso());
    }

    @Test
    void guardarArchivoPsicotecnica_deberiaLanzarExcepcionSiNoEsPDF() {
        // Arrange
        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "psicotecnico.txt", "text/plain", "texto inválido".getBytes()
        );

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            archivoPsicotecnicaService.guardarArchivoPsicotecnica(archivo, 2L,2L);
        });
    }

    @Test
    void getArchivoPsicotecnicaById_deberiaRetornarEntidad() {
        // Arrange
        ArchivoPsicotecnicaEntity entity = new ArchivoPsicotecnicaEntity();
        entity.setIdConductor(3L);

        when(archivoPsicotecnicaRepository.findById(10L)).thenReturn(Optional.of(entity));

        // Act
        ArchivoPsicotecnicaEntity resultado = archivoPsicotecnicaService.getArchivoPsicotecnicaById(10L);

        // Assert
        assertEquals(3L, resultado.getIdConductor());
    }
}
