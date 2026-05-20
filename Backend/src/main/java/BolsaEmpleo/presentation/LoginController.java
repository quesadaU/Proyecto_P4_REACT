package BolsaEmpleo.presentation;

import BolsaEmpleo.data.EmpresaRepository;
import BolsaEmpleo.data.OferentesRepository;
import BolsaEmpleo.logic.Base.Empresa;
import BolsaEmpleo.logic.Base.Oferente;
import BolsaEmpleo.logic.Base.Usuario;
import BolsaEmpleo.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    @Autowired private Service service;
    @Autowired private EmpresaRepository  empresaRepo;
    @Autowired private OferentesRepository oferenteRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @GetMapping("/login")
    public String mostrarLogin(
            @RequestParam(required = false) String error,
            Model model) {
        if (error != null) {
            model.addAttribute("error", "Usuario o contraseña incorrectos.");
        }
        return "presentation/Login/viewLogin";
    }

    @GetMapping("/login/empresa")
    public String mostrarRegistroEmpresa() {
        return "presentation/Login/viewRegistroEmpresa";
    }

    @GetMapping("/login/oferente")
    public String mostrarRegistroOferente() {
        return "presentation/Login/viewRegistroOferente";
    }

    @PostMapping("/registro/empresa")
    public String registrarEmpresa(
            @RequestParam String username,
            @RequestParam String clave,
            @RequestParam String nombre,
            @RequestParam String localizacion,
            @RequestParam String correo,
            @RequestParam String telefono,
            @RequestParam String descripcion,
            Model model) {
        try {
            // ← VALIDACIÓN: no permite espacios en blanco
            if (username.trim().isEmpty() || clave.trim().isEmpty()) {
                model.addAttribute("error", "El usuario y la contraseña no pueden estar en blanco o contener solo espacios.");
                return "presentation/Login/viewRegistroEmpresa";
            }

            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setUsername(username);
            nuevoUsuario.setClave(passwordEncoder.encode(clave));
            nuevoUsuario.setTipo("EMP");

            Empresa nuevaEmpresa = new Empresa();
            nuevaEmpresa.setUsuario(nuevoUsuario);
            nuevaEmpresa.setNombre(nombre);
            nuevaEmpresa.setLocalizacion(localizacion);
            nuevaEmpresa.setCorreo(correo);
            nuevaEmpresa.setTelefono(telefono);
            nuevaEmpresa.setDescripcion(descripcion);
            nuevaEmpresa.setAprobada(false);

            service.registrarEmpresa(nuevoUsuario, nuevaEmpresa);

            model.addAttribute("tipo", "EMP");
            return "presentation/Login/pendienteAprobacion";

        } catch (Exception e) {
            model.addAttribute("error", "Error al registrar: " + e.getMessage());
            return "presentation/Login/viewRegistroEmpresa";
        }
    }

    @PostMapping("/registro/oferente")
    public String registrarOferente(
            @RequestParam String username,
            @RequestParam String clave,
            @RequestParam String nombre,
            @RequestParam String apellido,
            @RequestParam String nacionalidad,
            @RequestParam String telefono,
            @RequestParam String correo,
            @RequestParam String residencia,
            Model model) {
        try {
            // ← VALIDACIÓN: no permite espacios en blanco
            if (username.trim().isEmpty() || clave.trim().isEmpty()) {
                model.addAttribute("error", "El usuario y la contraseña no pueden estar en blanco o contener solo espacios.");
                return "presentation/Login/viewRegistroOferente";
            }

            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setUsername(username);
            nuevoUsuario.setClave(passwordEncoder.encode(clave));
            nuevoUsuario.setTipo("OFE");

            Oferente nuevoOferente = new Oferente();
            nuevoOferente.setUsuario(nuevoUsuario);
            nuevoOferente.setNombre(nombre);
            nuevoOferente.setApellido(apellido);
            nuevoOferente.setNacionalidad(nacionalidad);
            nuevoOferente.setTelefono(telefono);
            nuevoOferente.setCorreo(correo);
            nuevoOferente.setResidencia(residencia);
            nuevoOferente.setAprobado(false);

            service.registrarOferente(nuevoUsuario, nuevoOferente);

            model.addAttribute("tipo", "OFE");
            return "presentation/Login/pendienteAprobacion";

        } catch (Exception e) {
            model.addAttribute("error", "Error al registrar: " + e.getMessage());
            return "presentation/Login/viewRegistroOferente";
        }
    }
}