package QualityTrans.TecnoQuality.Documentos.Services;

import QualityTrans.TecnoQuality.Documentos.Entities.CredencialEntity;
import QualityTrans.TecnoQuality.Documentos.Repositories.CredencialRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CredencialServiceTest {

    private CredencialRepository credencialRepository;
    private CredencialService credencialService;

    @BeforeEach
    void setUp() {
        credencialRepository = mock(CredencialRepository.class);
        credencialService = new CredencialService();
        credencialService.credencialRepository = credencialRepository; // Inyección manual
    }

    @Test
    void guardarCredencial_deberiaGuardarArchivoPDFCorrectamente() throws IOException {
        // Arrange
        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "documento.pdf", "application/pdf", "contenido de prueba".getBytes()
        );

        when(credencialRepository.save(any(CredencialEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        CredencialEntity guardado = credencialService.guardarCredencial(archivo, 1L, 1L);

        // Assert
        assertEquals(1L, guardado.getIdConductor());
        assertEquals(1L, guardado.getIdUsuario());
        assertEquals("application/pdf", guardado.getTipo());
        assertNotNull(guardado.getArchivoCredencial());
        assertEquals(LocalDate.now(), guardado.getFechaIngreso());
    }

    @Test
    void guardarCredencial_deberiaLanzarExcepcionSiNoEsPDF() {
        // Arrange
        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "documento.txt", "text/plain", "contenido inválido".getBytes()
        );

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> credencialService.guardarCredencial(archivo, 2L, 2L));
    }

    @Test
    void getCredencialById_deberiaRetornarCredencial() {
        // Arrange
        CredencialEntity entity = new CredencialEntity();
        entity.setIdConductor(3L);

        when(credencialRepository.findById(1L)).thenReturn(Optional.of(entity));

        // Act
        CredencialEntity resultado = credencialService.getCredencialById(1L);

        // Assert
        assertEquals(3L, resultado.getIdConductor());
    }
}
