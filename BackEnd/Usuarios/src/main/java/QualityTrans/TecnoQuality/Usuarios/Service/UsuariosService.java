package QualityTrans.TecnoQuality.Usuarios.Service;

import QualityTrans.TecnoQuality.Usuarios.Entity.Usuarios;
import QualityTrans.TecnoQuality.Usuarios.Model.Entrega;
import QualityTrans.TecnoQuality.Usuarios.Model.Login;
import QualityTrans.TecnoQuality.Usuarios.Model.UsuarioModelo;
import QualityTrans.TecnoQuality.Usuarios.Repository.UsuariosRepository;
import QualityTrans.TecnoQuality.Usuarios.Util.JwtUtil;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class UsuariosService {
    @Autowired
    UsuariosRepository usuariosRepository;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    RestTemplate restTemplate;

    //---------------------------------
    //General
    //---------------------------------

    public List<Usuarios> obtenerTodosLosUsuarios() {
        List<Usuarios> users = usuariosRepository.findAll();
        return users;
    }

    public Usuarios buscarUsuario(String email){
        Usuarios usuario = usuariosRepository.findByEmail(email);
        return usuario;
    }

    public Usuarios obtenerUsuario(String rut){
        Usuarios usuario = usuariosRepository.findByRut(rut);
        return usuario;
    }

    public Usuarios validarUsuario(String email, String password){
        Usuarios usuario = usuariosRepository.findByEmail(email.toLowerCase());
        if(usuario != null && usuario.getPassword().equals(password)){
            return usuario;
        }
        return null;
    }

    public String validar(Login login){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(login.getEmail(), login.getPassword()));

        if(authentication.isAuthenticated()){
            Usuarios usuario = buscarUsuario(login.getEmail());
            return jwtUtil.generateToken(usuario.getEmail());
        }

        return "Fallo";
    }

    public Entrega obtenerEntrega(Usuarios usuarios){
        Entrega entrega = new Entrega();
        entrega.rol_usuario = usuarios.getRol();
        entrega.id_usuario = usuarios.getId();
        entrega.nombre = usuarios.getNombre();
        return entrega;
    }

    public void validarToken(Cookie[] cookies) {
        if (cookies == null) {
            throw new IllegalStateException("Cookies not found");
        }

        String jwtCookie = Arrays.stream(cookies)
                .filter(c -> "JWT".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(() -> new IllegalStateException("JWT not found"));

        if (!jwtUtil.verifyToken(jwtCookie)) { // Usando el nuevo método
            throw new IllegalStateException("Invalid JWT");
        }
    }

    public Usuarios ingresarUsuario(Usuarios usuario){
        if (usuario != null && validarUsuarioByRut(usuario.getRut())){
            return usuariosRepository.save(usuario);
        } else {
            throw new IllegalArgumentException("Usuario no válido o ya existe");
        }
    }

    public boolean validarUsuarioByRut(String rut){
        Usuarios usuario = usuariosRepository.findByRut(rut);
        if(usuario != null){
            return false;
        } else {
            return true;
        }
    }

    public Usuarios actualizarUsuario(Usuarios usuario){
        if (usuario != null && !validarUsuarioByRut(usuario.getRut())){
            Usuarios usuarioExistente = usuariosRepository.findByRut(usuario.getRut());
            // Actualizar los campos del usuario existente
            usuarioExistente.setNombre(usuario.getNombre());
            usuarioExistente.setApellido(usuario.getApellido());
            usuarioExistente.setEmail(usuario.getEmail());
            usuarioExistente.setPassword(usuario.getPassword());
            usuarioExistente.setRol(usuario.getRol());
            usuarioExistente.setLocalidad(usuario.getLocalidad());
            return usuariosRepository.save(usuarioExistente);
        } else {
            throw new IllegalArgumentException("No se puede actualizar el usuario");
        }
    }

    public void eliminarUsuario(String rut){
        Usuarios usuario = usuariosRepository.findByRut(rut);
        if(usuario != null){
            usuariosRepository.delete(usuario);
        } else {
            throw new IllegalArgumentException("No se puede eliminar el usuario");
        }
    }

    public void eliminarUsuarioById(Long id){
        Usuarios usuario = usuariosRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No se puede eliminar el usuario"));
        usuariosRepository.delete(usuario);
    }
}
