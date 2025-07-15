package QualityTrans.TecnoQuality.Formularios.Config;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.docs.v1.Docs;
import com.google.api.services.drive.Drive;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Configuration
public class GoogleDocsConfig {
    private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @Bean
    public Docs googleDocsClient() throws GeneralSecurityException, IOException {
        NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        GoogleCredentials credentials = GoogleCredentials.fromStream(
                        new ClassPathResource("service-account.json").getInputStream())
                .createScoped(Collections.singleton("https://www.googleapis.com/auth/documents"));
        return new Docs.Builder(HTTP_TRANSPORT, JSON_FACTORY, new HttpCredentialsAdapter(credentials))
                .setApplicationName("Spring Boot Google Docs")
                .build();
    }

    @Bean
    public Drive driveService() throws GeneralSecurityException, IOException {
        NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        GoogleCredentials credentials = GoogleCredentials.fromStream(
                        new ClassPathResource("service-account.json").getInputStream())
                .createScoped(Collections.singleton("https://www.googleapis.com/auth/drive"));
        return new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, new HttpCredentialsAdapter(credentials))
                .setApplicationName("Spring Boot Google Docs")
                .build();
    }
}
