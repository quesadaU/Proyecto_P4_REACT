package BolsaEmpleo.presentation.APIs;

import BolsaEmpleo.logic.Base.Empresa;
import BolsaEmpleo.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "http://localhost:5173")
public class ApiEmpresaController {

    @Autowired
    private Service service;

    @GetMapping
    public List<Empresa> getAll() {
        return service.findAll_Empresas();
    }

    @PostMapping
    public Empresa save(@RequestBody Empresa empresa) {
        service.EmpresasAdd(empresa);
        return empresa;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.empresaDelete(id);
    }
}
