package BolsaEmpleo.presentation;

import BolsaEmpleo.data.UsuarioRepository;
import BolsaEmpleo.logic.Base.Empresa;
import BolsaEmpleo.logic.Base.Oferente;
import BolsaEmpleo.logic.Base.Usuario;
import BolsaEmpleo.logic.OferenteHabilidades;
import BolsaEmpleo.logic.Puesto;
import BolsaEmpleo.logic.PuestoHabilidades;
import BolsaEmpleo.logic.Service;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empresa")
@AllArgsConstructor
public class EmpresaController {

    private final Service           service;
    private final UsuarioRepository usuarioRepo;

    // Extrae la empresa del token JWT (campo "id" = usuarioId)
    private Empresa getEmpresa(Jwt jwt) {
        Integer usuarioId = ((Number) jwt.getClaims().get("id")).intValue();
        return service.empresaByUsuario(usuarioId);
    }

    // ── Dashboard / Perfil ────────────────────────────────────────────────────
    // GET /api/empresa/perfil
    // Response: { id, nombre, localizacion, correo, telefono, descripcion, aprobada }
    @GetMapping("/perfil")
    public Map<String, Object> perfil(@AuthenticationPrincipal Jwt jwt) {
        Empresa e = getEmpresa(jwt);
        Map<String, Object> r = new HashMap<>();
        r.put("id",           e.getId());
        r.put("nombre",       e.getNombre());
        r.put("localizacion", e.getLocalizacion());
        r.put("correo",       e.getCorreo());
        r.put("telefono",     e.getTelefono());
        r.put("descripcion",  e.getDescripcion());
        r.put("aprobada",     e.isAprobada());
        return r;
    }

    // PUT /api/empresa/perfil
    // Body: { "nombre","localizacion","correo","telefono","descripcion" }
    // Response: { "mensaje": "Perfil actualizado." }
    @PutMapping("/perfil")
    public Map<String, String> editarPerfil(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            Empresa e = getEmpresa(jwt);
            e.setNombre(body.get("nombre"));
            e.setLocalizacion(body.get("localizacion"));
            e.setCorreo(body.get("correo"));
            e.setTelefono(body.get("telefono"));
            e.setDescripcion(body.get("descripcion"));
            service.empresaUpdate(e);
            return Map.of("mensaje", "Perfil actualizado.");
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    // ── Puestos ───────────────────────────────────────────────────────────────
    // GET /api/empresa/puestos
    // Response: [ { id, descripcion, salario, tipo, estado, fecha }, ... ]
    @GetMapping("/puestos")
    public List<Puesto> misPuestos(@AuthenticationPrincipal Jwt jwt) {
        Empresa e = getEmpresa(jwt);
        return service.puestosByEmpresa(e.getId());
    }

    // POST /api/empresa/puestos
    // Body: { "descripcion": "Dev Java", "salario": 1500000, "tipo": "PUBLICO" }
    // Response 201: { "mensaje": "Puesto creado." }
    @PostMapping("/puestos")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> crearPuesto(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            Empresa e    = getEmpresa(jwt);
            String  desc = (String)  body.get("descripcion");
            Integer sal  = (Integer) body.get("salario");
            String  tipo = (String)  body.get("tipo");
            service.crearPuesto(e, desc, sal, tipo);
            return Map.of("mensaje", "Puesto creado.");
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    // GET /api/empresa/puestos/{id}
    // Response: { "puesto":{...}, "habilidades":[...], "caracteristicas":[...] }
    @GetMapping("/puestos/{id}")
    public Map<String, Object> detallePuesto(@PathVariable Integer id) {
        try {
            Puesto p = service.PuestoRead(id);
            List<PuestoHabilidades> habs = service.habilidadesByPuesto(id);
            Map<String, Object> r = new HashMap<>();
            r.put("puesto",          p);
            r.put("habilidades",     habs);
            r.put("caracteristicas", service.findAll_Caracteristicas());
            return r;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    // POST /api/empresa/puestos/{id}/desactivar
    // Response: { "mensaje": "Puesto desactivado." }
    @PostMapping("/puestos/{id}/desactivar")
    public Map<String, String> desactivarPuesto(@PathVariable Integer id) {
        service.desactivarPuesto(id);
        return Map.of("mensaje", "Puesto desactivado.");
    }

    // ── Habilidades del Puesto ────────────────────────────────────────────────
    // POST /api/empresa/puestos/habilidad
    // Body: { "puestoId": 3, "caracteristicaId": 2, "nivel": 3 }
    // Response 201: { "mensaje": "Habilidad agregada." }
    @PostMapping("/puestos/habilidad")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> agregarHabilidad(@RequestBody Map<String, Integer> body) {
        service.agregarHabilidadPuesto(body.get("puestoId"), body.get("caracteristicaId"), body.get("nivel"));
        return Map.of("mensaje", "Habilidad agregada.");
    }

    // DELETE /api/empresa/puestos/habilidad/{habilidadId}
    // Response: { "mensaje": "Habilidad eliminada." }
    @DeleteMapping("/puestos/habilidad/{habilidadId}")
    public Map<String, String> eliminarHabilidad(@PathVariable Integer habilidadId) {
        service.Puesto_hab_delete(habilidadId);
        return Map.of("mensaje", "Habilidad eliminada.");
    }

    // ── Candidatos ────────────────────────────────────────────────────────────
    // GET /api/empresa/candidatos?puestoId=3
    // Response: { "puesto":{...}, "candidatos":[{ oferente:{...}, coincidencias:N }, ...] }
    @GetMapping("/candidatos")
    public Map<String, Object> candidatos(@RequestParam Integer puestoId) {
        Puesto p = service.PuestoRead(puestoId);
        Map<String, Object> r = new HashMap<>();
        r.put("puesto",     p);
        r.put("candidatos", service.calcularCandidatos(puestoId));
        return r;
    }

    // GET /api/empresa/candidatos/{oferenteId}
    // Response: { "oferente":{...}, "habilidades":[...], "tieneCv": true/false }
    @GetMapping("/candidatos/{oferenteId}")
    public Map<String, Object> detalleOferente(@PathVariable Integer oferenteId) {
        Oferente o = service.findAll_Oferentes().stream()
                .filter(of -> of.getId().equals(oferenteId)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        List<OferenteHabilidades> habs = service.findAll_Oferente_hab().stream()
                .filter(h -> h.getOferente().getId().equals(oferenteId)).toList();
        Map<String, Object> r = new HashMap<>();
        r.put("oferente",    o);
        r.put("habilidades", habs);
        r.put("tieneCv",     o.getCurriculum() != null);
        return r;
    }

    // GET /api/empresa/candidatos/{oferenteId}/cv  → PDF binario
    @GetMapping("/candidatos/{oferenteId}/cv")
    public ResponseEntity<byte[]> cvOferente(@PathVariable Integer oferenteId) {
        Oferente o = service.findAll_Oferentes().stream()
                .filter(of -> of.getId().equals(oferenteId)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (o.getCurriculum() == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"cv_" + o.getNombre() + ".pdf\"")
                .body(o.getCurriculum());
    }
}
