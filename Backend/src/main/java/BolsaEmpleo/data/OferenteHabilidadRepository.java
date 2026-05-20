package BolsaEmpleo.data;

import BolsaEmpleo.logic.OferenteHabilidades;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OferenteHabilidadRepository extends JpaRepository<OferenteHabilidades, Integer> {

    // Habilidades registradas de un oferente concreto
    @Query("SELECT oh FROM OferenteHabilidades oh WHERE oh.oferente.id = :oferenteId")
    List<OferenteHabilidades> findByOferenteId(@Param("oferenteId") Integer oferenteId);
}