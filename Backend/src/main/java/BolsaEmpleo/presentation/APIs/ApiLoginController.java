package BolsaEmpleo.presentation.APIs;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ApiLoginController {

    @GetMapping("/me")
    public Map<String, String> me(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return Map.of("rol", "NONE");
        String rol = auth.getAuthorities().iterator().next().getAuthority();
        return Map.of("username", auth.getName(), "rol", rol);
    }
}
