package BolsaEmpleo.presentation;

import BolsaEmpleo.logic.Base.Caracteristicas;
import BolsaEmpleo.logic.Puesto;
import BolsaEmpleo.logic.Service;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    private final Service service;

    // ── Empresas Pendientes ───────────────────────────────────────────────────
    // GET /api/admin/empresas/pendientes
    // Response: [ { id, nombre, localizacion, correo, telefono, descripcion, aprobada:false }, ... ]
    @GetMapping("/empresas/pendientes")
    public List<?> empresasPendientes() {
        return service.findAll_EmpresasNoAprobadas();
    }

    // POST /api/admin/empresas/{id}/aprobar
    // Response: { "mensaje": "Empresa aprobada." }
    @PostMapping("/empresas/{id}/aprobar")
    public Map<String, String> aprobarEmpresa(@PathVariable Integer id) {
        try {
            service.aprobarEmpresa(id);
            return Map.of("mensaje", "Empresa aprobada.");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // ── Oferentes Pendientes ──────────────────────────────────────────────────
    // GET /api/admin/oferentes/pendientes
    // Response: [ { id, nombre, apellido, nacionalidad, correo, telefono, residencia, aprobado:false }, ... ]
    @GetMapping("/oferentes/pendientes")
    public List<?> oferentesPendientes() {
        return service.findAll_Oferentes_NoAprobadas();
    }

    // POST /api/admin/oferentes/{id}/aprobar
    // Response: { "mensaje": "Oferente aprobado." }
    @PostMapping("/oferentes/{id}/aprobar")
    public Map<String, String> aprobarOferente(@PathVariable Integer id) {
        try {
            service.aprobarOferente(id);
            return Map.of("mensaje", "Oferente aprobado.");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // ── Características ───────────────────────────────────────────────────────
    // GET /api/admin/caracteristicas
    // Response: { "padres": [...], "hijos": { "1": [...] }, "todas": [...] }
    @GetMapping("/caracteristicas")
    public Map<String, Object> caracteristicas() {
        List<Caracteristicas> padres = service.findPadresCaracteristicas();
        Map<Integer, List<Caracteristicas>> hijos = new HashMap<>();
        service.construirMapaHijos(padres, hijos);
        List<Caracteristicas> todas = service.findAll_Caracteristicas();
        Map<String, Object> result = new HashMap<>();
        result.put("padres", padres);
        result.put("hijos",  hijos);
        result.put("todas",  todas);
        return result;
    }

    // POST /api/admin/caracteristicas
    // Body: { "nombre": "Python", "padreId": 1 }   (padreId es opcional)
    // Response 201: { "mensaje": "Caracteristica creada." }
    @PostMapping("/caracteristicas")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> crearCaracteristica(@RequestBody Map<String, Object> body) {
        try {
            String  nombre  = (String) body.get("nombre");
            Integer padreId = body.get("padreId") != null ? (Integer) body.get("padreId") : null;
            service.crearCaracteristica(nombre, padreId);
            return Map.of("mensaje", "Caracteristica creada.");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // ── Reportes ──────────────────────────────────────────────────────────────
    // GET /api/admin/reportes/anios
    // Response: [2024, 2025, 2026]
    @GetMapping("/reportes/anios")
    public List<Integer> aniosDisponibles() {
        List<Integer> anios = service.aniosDisponibles();
        if (anios.isEmpty()) anios = List.of(java.time.LocalDate.now().getYear());
        return anios;
    }

    // GET /api/admin/reportes/pdf?anio=2026&mes=5
    // Response: PDF binario (application/pdf)
    @GetMapping("/reportes/pdf")
    public ResponseEntity<byte[]> generarReportePDF(
            @RequestParam int anio,
            @RequestParam int mes) throws IOException {

        List<Puesto> puestos = service.puestosPorMes(anio, mes);
        String nombreMes = Month.of(mes).getDisplayName(TextStyle.FULL, new Locale("es", "CR"));
        nombreMes = nombreMes.substring(0, 1).toUpperCase() + nombreMes.substring(1);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4, 50, 50, 60, 50);
        PdfWriter.getInstance(doc, baos);
        doc.open();

        Font fTitulo    = new Font(Font.HELVETICA, 18, Font.BOLD,   new Color(30, 58, 138));
        Font fSubtitulo = new Font(Font.HELVETICA, 11, Font.NORMAL, new Color(100, 116, 139));
        Font fHeader    = new Font(Font.HELVETICA,  9, Font.BOLD,   Color.WHITE);
        Font fCelda     = new Font(Font.HELVETICA,  9, Font.NORMAL, new Color(30, 30, 30));
        Font fResumen   = new Font(Font.HELVETICA, 10, Font.NORMAL, new Color(55, 65, 81));
        Font fResumenB  = new Font(Font.HELVETICA, 10, Font.BOLD,   new Color(30, 58, 138));

        Paragraph titulo = new Paragraph("Reporte de Puestos Solicitados", fTitulo);
        titulo.setAlignment(Element.ALIGN_CENTER);
        doc.add(titulo);

        Paragraph subtitulo = new Paragraph("Periodo: " + nombreMes + " " + anio, fSubtitulo);
        subtitulo.setAlignment(Element.ALIGN_CENTER);
        subtitulo.setSpacingAfter(6);
        doc.add(subtitulo);

        doc.add(new Chunk(new LineSeparator(1f, 100f, new Color(30, 58, 138), Element.ALIGN_CENTER, -2)));
        Paragraph espacio = new Paragraph(" ");
        espacio.setSpacingAfter(4);
        doc.add(espacio);

        long activos   = puestos.stream().filter(p -> "ACTIVO".equalsIgnoreCase(p.getEstado())).count();
        long inactivos = puestos.stream().filter(p -> "INACTIVO".equalsIgnoreCase(p.getEstado())).count();
        long publicos  = puestos.stream().filter(p -> "PUBLICO".equalsIgnoreCase(p.getTipo())).count();
        long privados  = puestos.stream().filter(p -> "PRIVADO".equalsIgnoreCase(p.getTipo())).count();

        PdfPTable resumen = new PdfPTable(4);
        resumen.setWidthPercentage(100);
        resumen.setSpacingAfter(14);
        Color bgResumen = new Color(239, 246, 255);
        String[] etiquetas = {"Total de puestos", "Activos", "Inactivos", "Publicos / Privados"};
        String[] valores   = {String.valueOf(puestos.size()), String.valueOf(activos),
                String.valueOf(inactivos), publicos + " / " + privados};
        for (int i = 0; i < 4; i++) {
            PdfPCell cEtiq = new PdfPCell(new Phrase(etiquetas[i], fResumen));
            cEtiq.setBackgroundColor(bgResumen); cEtiq.setBorderColor(new Color(191, 219, 254)); cEtiq.setPadding(6);
            resumen.addCell(cEtiq);
            PdfPCell cVal = new PdfPCell(new Phrase(valores[i], fResumenB));
            cVal.setBackgroundColor(bgResumen); cVal.setBorderColor(new Color(191, 219, 254));
            cVal.setPadding(6); cVal.setHorizontalAlignment(Element.ALIGN_CENTER);
            resumen.addCell(cVal);
        }
        doc.add(resumen);

        if (puestos.isEmpty()) {
            Paragraph vacio = new Paragraph(
                    "No se registraron puestos en " + nombreMes + " " + anio + ".",
                    new Font(Font.HELVETICA, 11, Font.ITALIC, new Color(107, 114, 128)));
            vacio.setAlignment(Element.ALIGN_CENTER); vacio.setSpacingBefore(20);
            doc.add(vacio);
        } else {
            PdfPTable tabla = new PdfPTable(new float[]{1.5f, 3.5f, 1.5f, 1.5f, 1.5f, 1.5f});
            tabla.setWidthPercentage(100); tabla.setSpacingBefore(4);
            Color bgHeader = new Color(30, 58, 138);
            for (String h : new String[]{"ID", "Descripcion", "Empresa", "Tipo", "Estado", "Fecha"}) {
                PdfPCell cell = new PdfPCell(new Phrase(h, fHeader));
                cell.setBackgroundColor(bgHeader); cell.setPadding(7);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER); cell.setBorder(Rectangle.NO_BORDER);
                tabla.addCell(cell);
            }
            Color bgPar = new Color(248, 250, 252), bgImpar = Color.WHITE, border = new Color(226, 232, 240);
            for (int i = 0; i < puestos.size(); i++) {
                Puesto p = puestos.get(i);
                Color bgFila = (i % 2 == 0) ? bgPar : bgImpar;
                for (String texto : new String[]{
                        String.valueOf(p.getId()),
                        p.getDescripcion() != null ? p.getDescripcion() : "-",
                        p.getEmpresa()     != null ? p.getEmpresa().getNombre() : "-",
                        p.getTipo()        != null ? p.getTipo()    : "-",
                        p.getEstado()      != null ? p.getEstado()  : "-",
                        p.getFecha()       != null ? p.getFecha()   : "-"}) {
                    PdfPCell cell = new PdfPCell(new Phrase(texto, fCelda));
                    cell.setBackgroundColor(bgFila); cell.setBorderColor(border); cell.setPadding(5);
                    tabla.addCell(cell);
                }
            }
            doc.add(tabla);
        }

        Paragraph pie = new Paragraph(
                "Generado el " + java.time.LocalDate.now() + " · Sistema Bolsa de Empleo",
                new Font(Font.HELVETICA, 8, Font.ITALIC, new Color(156, 163, 175)));
        pie.setAlignment(Element.ALIGN_RIGHT); pie.setSpacingBefore(16);
        doc.add(pie);
        doc.close();

        String filename = "reporte_puestos_" + anio + "_" + String.format("%02d", mes) + ".pdf";
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(baos.toByteArray());
    }
}
