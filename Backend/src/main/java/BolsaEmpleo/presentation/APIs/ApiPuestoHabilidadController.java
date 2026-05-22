package BolsaEmpleo.presentation.APIs;

import BolsaEmpleo.logic.Puesto;
import BolsaEmpleo.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/puestos")
@CrossOrigin(origins = "http://localhost:5173")
public class ApiPuestoHabilidadController {

    @Autowired
    private Service service;

    @GetMapping
    public List<Puesto> getAll() {
        return service.findAll_puesto_emp();
    }

    @PostMapping
    public Puesto save(@RequestBody Puesto puesto) {
        service.Puesto_emp_Add(puesto);
        return puesto;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.PuestoDelete(id);
    }
}
