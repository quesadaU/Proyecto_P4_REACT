package BolsaEmpleo.presentation;

import BolsaEmpleo.data.UsuarioRepository;
import BolsaEmpleo.logic.Base.Oferente;
import BolsaEmpleo.logic.Base.Usuario;
import BolsaEmpleo.logic.OferenteHabilidades;
import BolsaEmpleo.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@Controller
public class OferenteController {

    @Autowired private Service           service;
    @Autowired private UsuarioRepository usuarioRepo;

    private Oferente getOferente(Principal principal) {
        Usuario u = usuarioRepo.findByUsernameOnly(principal.getName());
        return service.oferenteByUsuario(u.getId());
    }

    // ── Dashboard ─────────────────────────────────────────────────

    @GetMapping("/DashboardOferente")
    public String mostrar_DashboardOferente(Principal principal, Model model) {
        Oferente oferente = getOferente(principal);
        // Verificar aprobación
        if (!oferente.isAprobado()) {
            model.addAttribute("tipo", "OFE");
            return "presentation/Login/pendienteAprobacion";
        }
        model.addAttribute("usuario", usuarioRepo.findByUsernameOnly(principal.getName()));
        return "presentation/Oferente/DashboardOferente";
    }

    // ── Habilidades ───────────────────────────────────────────────

    @GetMapping("/oferente/habilidades")
    public String mostrarHabilidades(Principal principal, Model model) {
        Oferente oferente = getOferente(principal);
        List<OferenteHabilidades> habilidades = service.findAll_Oferente_hab().stream()
                .filter(h -> h.getOferente().getId().equals(oferente.getId())).toList();
        model.addAttribute("usuario", usuarioRepo.findByUsernameOnly(principal.getName()));
        model.addAttribute("oferente", oferente);
        model.addAttribute("habilidades", habilidades);
        model.addAttribute("caracteristicas", service.findAll_Caracteristicas());
        return "presentation/Oferente/MisHabilidades";
    }

    @PostMapping("/oferente/habilidades")
    public String agregarHabilidad(
            @RequestParam Integer caracteristicaId,
            @RequestParam Integer nivel,
            Principal principal, Model model) {
        try {
            Oferente oferente = getOferente(principal);
            service.agregarHabilidadOferente(oferente.getId(), caracteristicaId, nivel);
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
        }
        return "redirect:/oferente/habilidades";
    }

    @PostMapping("/oferente/habilidades/eliminar")
    public String eliminarHabilidad(@RequestParam Integer habilidadId) {
        service.Oferente_hab_Delete(habilidadId);
        return "redirect:/oferente/habilidades";
    }

    // ── Currículum ────────────────────────────────────────────────

    @GetMapping("/oferente/curriculum")
    public String mostrarSubirCV(Principal principal, Model model) {
        Oferente oferente = getOferente(principal);
        model.addAttribute("usuario", usuarioRepo.findByUsernameOnly(principal.getName()));
        model.addAttribute("tieneCv", oferente.getCurriculum() != null);
        return "presentation/Oferente/SubirCV";
    }

    @PostMapping("/oferente/curriculum")
    public String subirCV(@RequestParam MultipartFile archivo,
                          Principal principal, Model model) {
        if (archivo.isEmpty()) {
            model.addAttribute("usuario", usuarioRepo.findByUsernameOnly(principal.getName()));
            model.addAttribute("error", "Por favor seleccioná un archivo PDF.");
            model.addAttribute("tieneCv", false);
            return "presentation/Oferente/SubirCV";
        }
        try {
            Oferente oferente = getOferente(principal);
            oferente.setCurriculum(archivo.getBytes());
            service.OferentesAdd(oferente);
        } catch (IOException e) {
            model.addAttribute("usuario", usuarioRepo.findByUsernameOnly(principal.getName()));
            model.addAttribute("error", "Error al leer el archivo: " + e.getMessage());
            return "presentation/Oferente/SubirCV";
        }
        return "redirect:/oferente/curriculum?ok";
    }

    @GetMapping("/oferente/curriculum/ver")
    public ResponseEntity<byte[]> verMiCV(Principal principal) {
        Oferente oferente = getOferente(principal);
        if (oferente.getCurriculum() == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"curriculum.pdf\"")
                .body(oferente.getCurriculum());
    }
}