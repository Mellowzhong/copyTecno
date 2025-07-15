package QualityTrans.TecnoQuality.Usuarios.Model;

public class AuthenticationResponse {
    private final String jwt;

    public AuthenticationResponse(String jwt) {
        this.jwt = jwt;
    }
}
