package QualityTrans.TecnoQuality.Documentos.Repositories;

import QualityTrans.TecnoQuality.Documentos.Entities.CredencialEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CredencialRepository extends JpaRepository <CredencialEntity, Long> {
    void deleteByIdConductorAndIdUsuario(Long idConductor, Long idUsuario);
    @Query("SELECT COUNT(a) > 0 FROM CredencialEntity a WHERE a.idConductor = :idConductor AND a.idUsuario = :idUsuario")
    boolean existsByIdConductorAndIdUsuario(@Param("idConductor") Long idConductor, @Param("idUsuario") Long idUsuario);

    CredencialEntity findByIdConductor(Long idConductor);
}
