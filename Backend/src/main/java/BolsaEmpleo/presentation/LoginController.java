package BolsaEmpleo.presentation;

import BolsaEmpleo.data.UsuarioRepository;
import BolsaEmpleo.logic.Base.Empresa;
import BolsaEmpleo.logic.Base.Oferente;
import BolsaEmpleo.logic.Base.Usuario;
import BolsaEmpleo.logic.Service;
import BolsaEmpleo.security.TokenService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class LoginController {

    private final Service          service;
    private final UsuarioRepository usuarioRepository;
    private final TokenService     tokenService;
    private final PasswordEncoder  passwordEncoder;

    // ── Login ─────────────────────────────────────────────────────────────────
    // POST /api/auth/login
    // Body: { "username": "admin1", "clave": "1234" }
    // Response: "eyJhbGci..." (token JWT como texto plano)
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String clave    = body.get("clave");
        try {
            Usuario u = usuarioRepository.findByUsernameOnly(username);
            if (u == null || !passwordEncoder.matches(clave, u.getClave())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
            }
            return tokenService.generateToken(u);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }

    // ── Registro Empresa ──────────────────────────────────────────────────────
    // POST /api/auth/registro/empresa
    // Body: { "username","clave","nombre","localizacion","correo","telefono","descripcion" }
    // Response 201: { "mensaje": "Empresa registrada. Pendiente de aprobación." }
    @PostMapping("/registro/empresa")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> registrarEmpresa(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String clave    = body.get("clave");
        if (username == null || username.trim().isEmpty() ||
                clave    == null || clave.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El usuario y la contraseña no pueden estar en blanco.");
        }
        try {
            Usuario u = new Usuario();
            u.setUsername(username);
            u.setClave(passwordEncoder.encode(clave));
            u.setTipo("EMP");

            Empresa e = new Empresa();
            e.setUsuario(u);
            e.setNombre(body.get("nombre"));
            e.setLocalizacion(body.get("localizacion"));
            e.setCorreo(body.get("correo"));
            e.setTelefono(body.get("telefono"));
            e.setDescripcion(body.get("descripcion"));
            e.setAprobada(false);

            service.registrarEmpresa(u, e);
            return Map.of("mensaje", "Empresa registrada. Pendiente de aprobacion.");
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }
    }

    // ── Registro Oferente ─────────────────────────────────────────────────────
    // POST /api/auth/registro/oferente
    // Body: { "username","clave","nombre","apellido","nacionalidad","telefono","correo","residencia" }
    // Response 201: { "mensaje": "Oferente registrado. Pendiente de aprobación." }
    @PostMapping("/registro/oferente")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> registrarOferente(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String clave    = body.get("clave");
        if (username == null || username.trim().isEmpty() ||
                clave    == null || clave.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El usuario y la contraseña no pueden estar en blanco.");
        }
        try {
            Usuario u = new Usuario();
            u.setUsername(username);
            u.setClave(passwordEncoder.encode(clave));
            u.setTipo("OFE");

            Oferente o = new Oferente();
            o.setUsuario(u);
            o.setNombre(body.get("nombre"));
            o.setApellido(body.get("apellido"));
            o.setNacionalidad(body.get("nacionalidad"));
            o.setTelefono(body.get("telefono"));
            o.setCorreo(body.get("correo"));
            o.setResidencia(body.get("residencia"));
            o.setAprobado(false);

            service.registrarOferente(u, o);
            return Map.of("mensaje", "Oferente registrado. Pendiente de aprobacion.");
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }
    }
}
