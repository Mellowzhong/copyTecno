package QualityTrans.TecnoQuality.Usuarios.Service;

import QualityTrans.TecnoQuality.Usuarios.Entity.Usuarios;
import QualityTrans.TecnoQuality.Usuarios.Model.UsuarioModelo;
import QualityTrans.TecnoQuality.Usuarios.Repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DetalleUsuarioService implements UserDetailsService {

    @Autowired
    UsuariosRepository usuariosRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Usuarios usuario = usuariosRepository.findByEmail(username);
        if(usuario == null){
            System.out.println("Usuario no encontrado");
            throw new UsernameNotFoundException("Usuario no encontrado");
        }
        return new UsuarioModelo(usuario);
    }
}
