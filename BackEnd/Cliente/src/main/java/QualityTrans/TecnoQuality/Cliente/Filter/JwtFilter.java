package QualityTrans.TecnoQuality.Cliente.Filter;

import QualityTrans.TecnoQuality.Cliente.Util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = null;
        String email = null;

        // 1. Buscar token en header o cookie
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        } else if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("JWT".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        try {
            if (token != null) {
                email = jwtUtil.extractUsername(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // 2. Validar el token y setear autenticación
                    if (jwtUtil.verifyToken(token)) {
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                email, null, List.of() // puedes reemplazar `List.of()` con roles si los extraes del JWT
                        );
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            }
        } catch (Exception ex) {
            // 3. Captura errores si el token es inválido o expirado
            System.out.println("Error en JwtFilter: " + ex.getMessage());
            // Opcional: podrías lanzar una excepción custom o devolver 401
        }

        filterChain.doFilter(request, response);
    }
}
