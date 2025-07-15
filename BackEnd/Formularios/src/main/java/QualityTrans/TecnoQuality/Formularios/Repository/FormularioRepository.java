package QualityTrans.TecnoQuality.Formularios.Repository;

import QualityTrans.TecnoQuality.Formularios.Entity.Formulario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormularioRepository extends JpaRepository<Formulario, Long> {
    void deleteByIdClienteAndIdUsuario(Long idCliente, Long idUsuario);
    List<Formulario> findByIdCliente(Long idCliente);
    @Query("SELECT COUNT(a) > 0 FROM Formulario a WHERE a.idCliente = :idCliente AND a.idUsuario = :idUsuario")
    boolean existsByIdClienteAndIdUsuario(@Param("idCliente") Long idCliente, @Param("idUsuario") Long idUsuario);
}
