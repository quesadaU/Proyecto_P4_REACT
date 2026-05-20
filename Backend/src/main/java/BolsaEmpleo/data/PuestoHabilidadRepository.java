package BolsaEmpleo.data;

import BolsaEmpleo.logic.Puesto;
import BolsaEmpleo.logic.PuestoHabilidades;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PuestoHabilidadRepository extends JpaRepository<PuestoHabilidades, Integer> {

    // Habilidades requeridas por un puesto concreto
    @Query("SELECT ph FROM PuestoHabilidades ph WHERE ph.puesto.id = :puestoId")
    List<PuestoHabilidades> findByPuestoId(@Param("puestoId") Integer puestoId);

    // Puestos PÚBLICOS y ACTIVOS que tengan al menos una de las características dadas
    @Query("SELECT DISTINCT ph.puesto FROM PuestoHabilidades ph " +
            "WHERE ph.habilidad.id IN :ids " +
            "AND ph.puesto.tipo = 'PUBLICO' " +
            "AND ph.puesto.estado = 'ACTIVO'")
    List<Puesto> findPuestosPublicosByCaracteristicas(@Param("ids") List<Integer> ids);
}