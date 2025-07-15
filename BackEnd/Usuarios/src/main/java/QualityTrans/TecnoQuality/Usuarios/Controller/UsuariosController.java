package QualityTrans.TecnoQuality.Usuarios.Controller;

import QualityTrans.TecnoQuality.Usuarios.Entity.Usuarios;
import QualityTrans.TecnoQuality.Usuarios.Model.AuthenticationResponse;
import QualityTrans.TecnoQuality.Usuarios.Model.Entrega;
import QualityTrans.TecnoQuality.Usuarios.Model.Login;
import QualityTrans.TecnoQuality.Usuarios.Service.UsuariosService;
import QualityTrans.TecnoQuality.Usuarios.Util.JwtUtil;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.impl.JwtTokenizer;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/Usuario")
public class UsuariosController {
    @Autowired
    UsuariosService usuariosService;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/login")
    public ResponseEntity<Entrega> login2(@RequestBody Login login, HttpServletResponse response) {
        String token = usuariosService.validar(login);
        Entrega entrega = usuariosService.obtenerEntrega(usuariosService.buscarUsuario(login.getEmail()));
        String cookieValue = "JWT=" + token + "; HttpOnly; Secure; SameSite=none; Path=/; Max-Age=" + (60 * 60 * 24);
        response.addHeader("Set-Cookie", cookieValue);
        return ResponseEntity.ok(entrega);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Boolean>> logout(HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("JWT", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);

        response.addCookie(jwtCookie);

        HashMap<String, Boolean> message = new HashMap<>();
        message.put("success", true);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @PostMapping("/verify-token")
    public ResponseEntity<Map<String,Boolean>> verifyToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        usuariosService.validarToken(cookies);
        HashMap<String, Boolean> message = new HashMap<>();
        message.put("success", true);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @GetMapping("/obtenerUsuarios")
    public ResponseEntity<List<Usuarios>> obtenerTodosLosUsuarios() {
        return ResponseEntity.ok(usuariosService.obtenerTodosLosUsuarios());
    }

    @GetMapping("/obtenerUsuario/{rut}")
    public ResponseEntity<Usuarios> obtenerUsuario(@PathVariable String rut) {
        Usuarios usuario = usuariosService.obtenerUsuario(rut);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/ingresarUsuario")
    public ResponseEntity<Usuarios> ingresarUsuario(@RequestBody Usuarios usuario) {
        Usuarios usuarioNuevo = usuariosService.ingresarUsuario(usuario);
        return ResponseEntity.ok(usuarioNuevo);
    }

    @PostMapping("/actualizarUsuario")
    public ResponseEntity<Usuarios> actualizarUsuario(@RequestBody Usuarios usuario) {
        System.out.println(usuario);
        Usuarios usuarioActualizado = usuariosService.actualizarUsuario(usuario);
        return ResponseEntity.ok(usuarioActualizado);
    }

    @DeleteMapping("/eliminarUsuario/{rut}")
    public ResponseEntity<Map<String, String>> eliminarUsuario(@PathVariable String rut) {
        try {
            usuariosService.eliminarUsuario(rut);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Usuario eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @DeleteMapping("/eliminarUsuarioById/{id}")
    public ResponseEntity<Map<String, String>> eliminarUsuario(@PathVariable Long id) {
        try {
            usuariosService.eliminarUsuarioById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Usuario eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

}