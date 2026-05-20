package BolsaEmpleo.presentation;

import BolsaEmpleo.data.UsuarioRepository;
import BolsaEmpleo.logic.Base.Empresa;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
import java.util.List;

@Controller
public class EmpresaController {

    @Autowired private Service           service;
    @Autowired private UsuarioRepository usuarioRepo;

    private Empresa getEmpresa(Principal principal) {
        Usuario u = usuarioRepo.findByUsernameOnly(principal.getName());
        return service.empresaByUsuario(u.getId());
    }

    // ── Dashboard ─────────────────────────────────────────────────

    @GetMapping("/DashboardEmpresa")
    public String mostrar_DashboardEmpresa(Principal principal, Model model) {
        Empresa empresa = getEmpresa(principal);
        if (!empresa.isAprobada()) {
            model.addAttribute("tipo", "EMP");
            return "presentation/Login/pendienteAprobacion";
        }
        model.addAttribute("empresa", empresa);
        return "presentation/Empresa/DashboardEmpresa";
    }

    // ── Editar empresa ────────────────────────────────────────────

    @GetMapping("/empresa/editar")
    public String mostrar_EditarEmpresa(Principal principal, Model model) {
        model.addAttribute("empresa", getEmpresa(principal));
        return "presentation/Empresa/EditarEmpresa";
    }

    @PostMapping("/empresa/editar")
    public String guardar_EditarEmpresa(
            @RequestParam String nombre,
            @RequestParam String localizacion,
            @RequestParam String correo,
            @RequestParam String telefono,
            @RequestParam String descripcion,
            Principal principal, Model model) {
        try {
            Empresa empresa = getEmpresa(principal);
            empresa.setNombre(nombre); empresa.setLocalizacion(localizacion);
            empresa.setCorreo(correo); empresa.setTelefono(telefono);
            empresa.setDescripcion(descripcion);
            service.empresaUpdate(empresa);
            return "redirect:/DashboardEmpresa?exito=true";
        } catch (Exception e) {
            model.addAttribute("error", "Error al guardar: " + e.getMessage());
            model.addAttribute("empresa", getEmpresa(principal));
            return "presentation/Empresa/EditarEmpresa";
        }
    }

    // ── Mis puestos ───────────────────────────────────────────────

    @GetMapping("/empresa/puestos")
    public String mostrar_MisPuestos(Principal principal, Model model) {
        Empresa empresa = getEmpresa(principal);
        model.addAttribute("empresa", empresa);
        model.addAttribute("puestos", service.puestosByEmpresa(empresa.getId()));
        return "presentation/Empresa/MisPuestos";
    }

    // ── Nuevo puesto ──────────────────────────────────────────────

    @GetMapping("/empresa/puestos/nuevo")
    public String mostrar_NuevoPuesto(Model model) {
        model.addAttribute("caracteristicas", service.findAll_Caracteristicas());
        return "presentation/Empresa/NuevoPuesto";
    }

    @PostMapping("/empresa/puestos/nuevo")
    public String crear_Puesto(
            @RequestParam String descripcion,
            @RequestParam Integer salario,
            @RequestParam String tipo,
            Principal principal, Model model) {
        try {
            service.crearPuesto(getEmpresa(principal), descripcion, salario, tipo);
            return "redirect:/empresa/puestos?exito=true";
        } catch (Exception e) {
            model.addAttribute("error", "Error al crear el puesto: " + e.getMessage());
            model.addAttribute("caracteristicas", service.findAll_Caracteristicas());
            return "presentation/Empresa/NuevoPuesto";
        }
    }

    // ── Habilidades de un puesto ──────────────────────────────────

    @PostMapping("/empresa/puestos/habilidad")
    public String agregar_HabilidadPuesto(
            @RequestParam Integer puestoId,
            @RequestParam Integer caracteristicaId,
            @RequestParam Integer nivel) {
        service.agregarHabilidadPuesto(puestoId, caracteristicaId, nivel);
        return "redirect:/empresa/puestos/" + puestoId;
    }

    @PostMapping("/empresa/puestos/habilidad/eliminar")  // ← NUEVO
    public String eliminar_HabilidadPuesto(
            @RequestParam Integer habilidadId,
            @RequestParam Integer puestoId) {
        service.Puesto_hab_delete(habilidadId);
        return "redirect:/empresa/puestos/" + puestoId;
    }

    @GetMapping("/empresa/puestos/{id}")
    public String mostrar_DetallePuesto(@PathVariable Integer id, Model model) {
        model.addAttribute("puesto", service.PuestoRead(id));
        model.addAttribute("habilidades", service.habilidadesByPuesto(id));
        model.addAttribute("caracteristicas", service.findAll_Caracteristicas());
        return "presentation/Empresa/DetallePuesto";
    }

    // ── Desactivar puesto ─────────────────────────────────────────

    @PostMapping("/empresa/puestos/desactivar")
    public String desactivar_Puesto(@RequestParam Integer puestoId) {
        service.desactivarPuesto(puestoId);
        return "redirect:/empresa/puestos";
    }

    // ── Candidatos ────────────────────────────────────────────────

    @GetMapping("/empresa/candidatos")
    public String mostrar_Candidatos(@RequestParam Integer puestoId, Model model) {
        model.addAttribute("puesto", service.PuestoRead(puestoId));
        model.addAttribute("candidatos", service.calcularCandidatos(puestoId));
        return "presentation/Empresa/Candidatos";
    }

    @GetMapping("/empresa/candidatos/detalle")
    public String mostrar_DetalleOferente(
            @RequestParam Integer oferenteId,
            @RequestParam(required = false) Integer puestoId,
            Model model) {

        Oferente oferente = service.findAll_Oferentes().stream()
                .filter(o -> o.getId().equals(oferenteId)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado"));

        List<OferenteHabilidades> habilidades = service.findAll_Oferente_hab().stream()
                .filter(h -> h.getOferente().getId().equals(oferenteId)).toList();

        model.addAttribute("oferente", oferente);
        model.addAttribute("habilidades", habilidades);
        model.addAttribute("tieneCv", oferente.getCurriculum() != null);
        model.addAttribute("urlVolver", puestoId != null
                ? "/empresa/candidatos?puestoId=" + puestoId : "/empresa/puestos");
        return "presentation/Empresa/DetalleOferente";
    }

    @GetMapping("/empresa/candidatos/cv")
    public ResponseEntity<byte[]> verCvOferente(@RequestParam Integer oferenteId) {
        Oferente oferente = service.findAll_Oferentes().stream()
                .filter(o -> o.getId().equals(oferenteId)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado"));
        if (oferente.getCurriculum() == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"cv_" + oferente.getNombre() + ".pdf\"")
                .body(oferente.getCurriculum());
    }
}