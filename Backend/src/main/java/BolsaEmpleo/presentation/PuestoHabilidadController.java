package BolsaEmpleo.presentation;

import BolsaEmpleo.logic.Service;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

public class PuestoHabilidadController {

    private Service service;

    @GetMapping("/buscarporhabilidad")

    //Devuelve las PuestoHabilidades por habilidad seleccionada en el buscador
    //En la vista se deben sacar los puestos de cada puestoHabilidad
    public String buscar_por_habilidad(Model model) {
        model.addAttribute("puestos",service.findBySkill(model.toString()));
        return "presentation/viewpublic";
    }

}
