package BolsaEmpleo.data;

import BolsaEmpleo.logic.Base.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    //PARA VALIDACIÓN EN EL LOGIN
    @Query("select u from Usuario u where u.username = ?1 and u.clave = ?2")
    public Usuario findByUsername(String username,String clave);

    @Query("select u from Usuario u where u.username = ?1")
    public Usuario findByUsernameOnly(String username);
}
