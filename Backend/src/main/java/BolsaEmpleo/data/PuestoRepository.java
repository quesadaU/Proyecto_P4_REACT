package BolsaEmpleo.data;

import BolsaEmpleo.logic.Puesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PuestoRepository extends JpaRepository<Puesto, Integer> {

    // Top 5 puestos públicos más recientes para la página de inicio
    @Query(value = "SELECT * FROM puesto WHERE tipo = 'PUBLICO' ORDER BY id DESC LIMIT 5", nativeQuery = true)
    List<Puesto> findTop5Puestos();

    // Todos los puestos activos de una empresa específica
    @Query("SELECT p FROM Puesto p WHERE p.empresa.id = :empresaId")
    List<Puesto> findByEmpresaId(@Param("empresaId") Integer empresaId);

    // Puestos públicos que tengan AL MENOS UNA de las características seleccionadas
    @Query("SELECT DISTINCT ph.puesto FROM PuestoHabilidades ph " +
            "WHERE ph.habilidad.id IN :ids " +
            "AND ph.puesto.tipo = 'PUBLICO' " +
            "AND ph.puesto.estado = 'ACTIVO'")
    List<Puesto> findPuestosPublicosByCaracteristicas(@Param("ids") List<Integer> ids);
}