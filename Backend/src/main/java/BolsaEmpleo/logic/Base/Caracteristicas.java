package BolsaEmpleo.logic.Base;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "caracteristicas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Caracteristicas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;
    // esto me lo tiro el Intellij para el tema de la relación ciclica (josue)
    @ManyToOne
    @JoinColumn(name = "padre_id") // ← relación cíclica, está bien
    private Caracteristicas Padre;



}
