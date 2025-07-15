package QualityTrans.TecnoQuality.Usuarios.Repository;

import QualityTrans.TecnoQuality.Usuarios.Entity.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {
    Usuarios findByEmail(String email);
    Usuarios findByRut(String rut);
    Usuarios deleteByRut(String rut);

}
