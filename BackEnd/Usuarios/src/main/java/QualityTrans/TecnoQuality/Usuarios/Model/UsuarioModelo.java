package QualityTrans.TecnoQuality.Usuarios.Model;

import QualityTrans.TecnoQuality.Usuarios.Entity.Usuarios;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


public class UsuarioModelo implements UserDetails {

    private Usuarios usuario;

    public UsuarioModelo(Usuarios usuario) {
        this.usuario = usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_ADMIN"),
                new SimpleGrantedAuthority("ROLE_SECRETARIA"),
                new SimpleGrantedAuthority("ROLE_MEDICO"),
                new SimpleGrantedAuthority("ROLE_PSICOLOGO"),
                new SimpleGrantedAuthority("ROLE_PSICOTECNICO"),
                new SimpleGrantedAuthority("ROLE_PRUEBA")
        );
    }

    @Override
    public String getPassword() {
        return usuario.getPassword();
    }

    @Override
    public String getUsername() {
        return usuario.getEmail();
    }

    //Corregir despues
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    //Corregir despues
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    //Corregir despues
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //Corregir despues
    @Override
    public boolean isEnabled() {
        return true;
    }
}
