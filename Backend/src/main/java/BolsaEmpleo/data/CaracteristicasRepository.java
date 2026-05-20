package BolsaEmpleo.data;

import BolsaEmpleo.logic.Base.Caracteristicas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CaracteristicasRepository  extends JpaRepository<Caracteristicas,Integer> {
  //Metodos para el Buscar Caracteristicas
    // Solo las raíces — las que no tienen padre
    @Query("select c from Caracteristicas c where c.Padre is null")
    List<Caracteristicas> findPadres();

    // Hijos directos de una categoría
    @Query("select c from Caracteristicas c where c.Padre.id = ?1")
    List<Caracteristicas> findHijos(Integer padreId);
}

