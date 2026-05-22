package BolsaEmpleo.presentation.APIs;

import BolsaEmpleo.data.OferentesRepository;
import BolsaEmpleo.logic.Base.Oferente;
import BolsaEmpleo.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/oferentes")
@CrossOrigin(origins = "http://localhost:5173")
public class ApiOferenteController {

    @Autowired private Service service;
    @Autowired private OferentesRepository oferentesRepository;

    @GetMapping
    public List<Oferente> getAll() {
        return service.findAll_Oferentes();
    }

    @PostMapping
    public Oferente save(@RequestBody Oferente oferente) {
        service.OferentesAdd(oferente);
        return oferente;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        oferentesRepository.deleteById(id);
    }
}
