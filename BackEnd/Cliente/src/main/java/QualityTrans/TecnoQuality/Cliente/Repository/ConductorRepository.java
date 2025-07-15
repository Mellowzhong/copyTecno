package QualityTrans.TecnoQuality.Cliente.Repository;

import QualityTrans.TecnoQuality.Cliente.Entity.Conductor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ConductorRepository extends JpaRepository<Conductor, Long> {
    Conductor findByRun(String run);

    Conductor deleteByRun(String run);
    List<Conductor> findAllByFechaCreacion(LocalDate fechaCreacion);
    List<Conductor> findByFechaCreacionBetween(LocalDate desde, LocalDate hasta);
}
