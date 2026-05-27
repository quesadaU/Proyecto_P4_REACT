package BolsaEmpleo.presentation;

import BolsaEmpleo.data.UsuarioRepository;
import BolsaEmpleo.logic.Base.Empresa;
import BolsaEmpleo.logic.Base.Oferente;
import BolsaEmpleo.logic.Base.Usuario;
import BolsaEmpleo.logic.Service;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  AuthController  (antes: LoginController)                        ║
 * ║  Reemplaza las vistas de login/registro por endpoints REST.      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * RUTAS:
 *  POST /api/auth/login            → manejado por Spring Security (SecurityConfig)
 *  POST /api/auth/logout           → manejado por Spring Security
 *  GET  /api/auth/me               → devuelve el usuario logueado actual
 *  POST /api/auth/registro/empresa → registrar nueva empresa
 *  POST /api/auth/registro/oferente→ registrar nuevo oferente
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private Service          service;
    @Autowired private PasswordEncoder  passwordEncoder;
    @Autowired private UsuarioRepository usuarioRepo;

    // ── GET /api/auth/me ─────────────────────────────────────────────
    // React lo llama al montar la app para saber si hay sesión activa.
    //
    // Response 200:
    //   { "username": "juan", "rol": "EMP" }
    // Response 401 (sin sesión):
    //   Spring Security devuelve 401 automáticamente.
    @GetMapping("/me")
    public ResponseEntity<?> me(Principal principal, HttpServletRequest request) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autenticado"));
        }
        Usuario u = usuarioRepo.findByUsernameOnly(principal.getName());
        return ResponseEntity.ok(Map.of(
                "username", u.getUsername(),
                "rol",      u.getTipo()
        ));
    }

    // ── POST /api/auth/registro/empresa ──────────────────────────────
    //
    // Request body (JSON):
    // {
    //   "username":    "empresa1",
    //   "clave":       "pass123",
    //   "nombre":      "Empresa SA",
    //   "localizacion":"San José",
    //   "correo":      "info@empresa.com",
    //   "telefono":    "88001122",
    //   "descripcion": "Empresa de tecnología"
    // }
    //
    // Response 201:
    //   { "mensaje": "Empresa registrada. Pendiente de aprobación." }
    // Response 400 / 409:
    //   { "error": "El nombre de usuario ya está en uso." }
    @PostMapping("/registro/empresa")
    public ResponseEntity<?> registrarEmpresa(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            String clave    = body.get("clave");

            if (username == null || username.isBlank() || clave == null || clave.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "El usuario y la contraseña no pueden estar en blanco."));
            }

            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setUsername(username);
            nuevoUsuario.setClave(passwordEncoder.encode(clave));
            nuevoUsuario.setTipo("EMP");

            Empresa nuevaEmpresa = new Empresa();
            nuevaEmpresa.setUsuario(nuevoUsuario);
            nuevaEmpresa.setNombre(body.get("nombre"));
            nuevaEmpresa.setLocalizacion(body.get("localizacion"));
            nuevaEmpresa.setCorreo(body.get("correo"));
            nuevaEmpresa.setTelefono(body.get("telefono"));
            nuevaEmpresa.setDescripcion(body.get("descripcion"));
            nuevaEmpresa.setAprobada(false);

            service.registrarEmpresa(nuevoUsuario, nuevaEmpresa);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("mensaje", "Empresa registrada. Pendiente de aprobación."));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al registrar: " + e.getMessage()));
        }
    }

    // ── POST /api/auth/registro/oferente ─────────────────────────────
    //
    // Request body (JSON):
    // {
    //   "username":    "oferente1",
    //   "clave":       "pass123",
    //   "nombre":      "Juan",
    //   "apellido":    "Pérez",
    //   "nacionalidad":"Costarricense",
    //   "telefono":    "88001122",
    //   "correo":      "juan@mail.com",
    //   "residencia":  "San José"
    // }
    //
    // Response 201:
    //   { "mensaje": "Oferente registrado. Pendiente de aprobación." }
    // Response 400 / 409:
    //   { "error": "El nombre de usuario ya está en uso." }
    @PostMapping("/registro/oferente")
    public ResponseEntity<?> registrarOferente(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            String clave    = body.get("clave");

            if (username == null || username.isBlank() || clave == null || clave.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "El usuario y la contraseña no pueden estar en blanco."));
            }

            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setUsername(username);
            nuevoUsuario.setClave(passwordEncoder.encode(clave));
            nuevoUsuario.setTipo("OFE");

            Oferente nuevoOferente = new Oferente();
            nuevoOferente.setUsuario(nuevoUsuario);
            nuevoOferente.setNombre(body.get("nombre"));
            nuevoOferente.setApellido(body.get("apellido"));
            nuevoOferente.setNacionalidad(body.get("nacionalidad"));
            nuevoOferente.setTelefono(body.get("telefono"));
            nuevoOferente.setCorreo(body.get("correo"));
            nuevoOferente.setResidencia(body.get("residencia"));
            nuevoOferente.setAprobado(false);

            service.registrarOferente(nuevoUsuario, nuevoOferente);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("mensaje", "Oferente registrado. Pendiente de aprobación."));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al registrar: " + e.getMessage()));
        }
    }
}
