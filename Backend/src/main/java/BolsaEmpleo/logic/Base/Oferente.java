package BolsaEmpleo.logic.Base;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "oferente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Oferente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name ="usuario_id")
    private Usuario usuario;


    private String nombre;
    private String apellido;
    private String nacionalidad;
    private String telefono;
    private String correo;
    private String residencia;
    //Para que el Administrador la apruebe
    private boolean aprobado = false;



    // Currículum en formato PDF (guardado como bytes en la BD)
    @Lob
    @Column(name = "curriculum", columnDefinition = "LONGBLOB")
    private byte[] curriculum;

}
/*
* ID(pk) - Nombre - Apellido - Pais - Telefono -correo -residencia -aprobada
* */


