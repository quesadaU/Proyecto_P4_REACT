package BolsaEmpleo.logic.Base;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "administrador")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Administrador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;//PK FK

    @OneToOne
    @MapsId
    @JoinColumn(name = "usuario_id")   // ← nombre explícito de la FK
    private Usuario usuario;

    private String identificacion; // cedula
    private String nombre;
    private String correo;

}
