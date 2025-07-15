package QualityTrans.TecnoQuality.Cliente.Repository;

import QualityTrans.TecnoQuality.Cliente.Entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    Empresa findByRutEmpresa(String rutEmpresa);

    Empresa findByNombreEmpresa(String nombreEmpresa);

    Empresa deleteByRutEmpresa(String rutEmpresa);

}
