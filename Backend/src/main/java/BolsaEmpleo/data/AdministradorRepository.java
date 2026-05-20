package BolsaEmpleo.data;

import BolsaEmpleo.logic.Base.Administrador;
import BolsaEmpleo.logic.Base.Oferente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdministradorRepository extends JpaRepository<Administrador,Integer> {
    @Query("select o from Oferente o where o.aprobado = true")
    List<Oferente> buscarAprobadosOferentes();

}
