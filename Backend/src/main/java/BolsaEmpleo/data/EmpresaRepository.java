package BolsaEmpleo.data;

import BolsaEmpleo.logic.Base.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {

    // Busca la empresa por el id del usuario logueado (FK usuario_id)
    @Query("SELECT e FROM Empresa e WHERE e.usuario.id = ?1")
    Empresa findByUsuarioId(Integer usuarioId);

    @Query("SELECT e FROM Empresa e WHERE e.aprobada = true")
    List<Empresa> findAllByAprobada();

    @Query("SELECT e FROM Empresa e WHERE e.aprobada = false")
    List<Empresa> findAllByNoAprobada();

    @Query("SELECT e FROM Empresa e WHERE e.nombre LIKE %?1%")
    List<Empresa> findByNombre(String nombre);
}