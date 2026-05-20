package BolsaEmpleo.logic;

import BolsaEmpleo.logic.Base.Caracteristicas;
import BolsaEmpleo.logic.Base.Oferente;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity                                // ← faltaba
@Table(name = "oferente_habilidades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class OferenteHabilidades {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "oferente_id")
    private Oferente oferente;

    @ManyToOne
    @JoinColumn(name = "caracteristicas_id")
    private Caracteristicas caracteristicas;

    private Integer nivel;

}
