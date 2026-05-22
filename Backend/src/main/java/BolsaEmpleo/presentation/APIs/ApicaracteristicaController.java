package BolsaEmpleo.presentation.APIs;

import BolsaEmpleo.logic.Base.Caracteristicas;
import BolsaEmpleo.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caracteristicas")
@CrossOrigin(origins = "http://localhost:5173")
public class ApicaracteristicaController {

    @Autowired
    private Service service;

    @GetMapping
    public List<Caracteristicas> getAll() {
        return service.findAll_Caracteristicas();
    }

    @PostMapping
    public void save(@RequestParam String nombre,
                     @RequestParam(required = false) Integer padreId) {
        service.crearCaracteristica(nombre, padreId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.caracteristicasDelete(id);
    }
}
