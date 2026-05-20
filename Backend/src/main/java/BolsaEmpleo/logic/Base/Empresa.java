package BolsaEmpleo.logic.Base;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "empresa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "usuario_id")   // ← nombre explícito de la FK
    private Usuario usuario;

    private String nombre;
    private String localizacion;
    private String correo;
    private String telefono;
    private String descripcion;

    //Para que el Administrador la apruebe
    private boolean aprobada = false;
}

/*
* ID(Pk)- Nombre -localización-correo-telefono-descripción-aprobada
*
* */