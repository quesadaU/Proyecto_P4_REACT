package BolsaEmpleo.data;

import BolsaEmpleo.logic.Base.Oferente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OferentesRepository extends JpaRepository<Oferente, Integer> {

        // Oferentes ya aprobados
        @Query("select o from Oferente o where o.aprobado = true")
        List<Oferente> findAllByAprobadaOferente();

        // Oferentes pendientes de aprobación — usado por el Admin
        @Query("select o from Oferente o where o.aprobado = false")
        List<Oferente> findAllByNoAprobadaOferente();

        // Búsqueda por nombre (por si se necesita en el futuro)
        @Query("select o from Oferente o where o.nombre like %?1%")
        List<Oferente> findByNombre(String nombre);

}
