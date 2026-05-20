package BolsaEmpleo.logic;

import BolsaEmpleo.logic.Base.Empresa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "puesto")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Puesto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    private String descripcion;
    private Integer salario;
    private String tipo;    // PUBLICO | PRIVADO
    private String estado; //"ACTIVO" | "INACTIVO"
    private String fecha;

}
