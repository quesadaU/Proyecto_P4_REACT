import { Link } from 'react-router-dom';

function RegistroEmpresa() {
    return (
        <section className="container seccion-registro">
            <div className="row justify-content-center">
                <div className="col-md-7 col-lg-6">
                    <div className="card p-4">
                        <h5 className="mb-4 fw-bold text-center">Completá los datos de tu empresa</h5>

                        <form method="POST" action="http://localhost:8080/registro/empresa">
                            <div className="bloque-form">
                                <h6>Credenciales de acceso</h6>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nombre de usuario <span className="text-danger">*</span></label>
                                    <input type="text" name="username" className="form-control" placeholder="ej: mi_empresa" required minLength="4"/>
                                    <div className="form-text">Este será tu usuario para iniciar sesión.</div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Contraseña <span className="text-danger">*</span></label>
                                    <input type="password" name="clave" className="form-control" placeholder="Mínimo 6 caracteres" required minLength="6"/>
                                </div>
                            </div>
                            <div className="bloque-form">
                                <h6>Datos de la empresa</h6>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nombre de la empresa <span className="text-danger">*</span></label>
                                    <input type="text" name="nombre" className="form-control" placeholder="ej: TechCorp S.A." required/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Localización <span className="text-danger">*</span></label>
                                    <input type="text" name="localizacion" className="form-control" placeholder="ej: San José, Costa Rica" required/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Correo electrónico <span className="text-danger">*</span></label>
                                    <input type="email" name="correo" className="form-control" placeholder="empresa@correo.com" required/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Teléfono <span className="text-danger">*</span></label>
                                    <input type="tel" name="telefono" className="form-control" placeholder="ej: 2222-3333" required/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Descripción <span className="text-danger">*</span></label>
                                    <textarea name="descripcion" className="form-control" rows="3" placeholder="Breve descripción de la empresa..." required></textarea>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mt-2">Registrar empresa</button>
                            <p className="text-center text-muted small mt-3">
                                Tu cuenta quedará pendiente de aprobación por un administrador.<br/>
                                Los campos con <span className="text-danger">*</span> son obligatorios.
                            </p>
                        </form>

                        <hr/>
                        <div className="text-center small">
                            <Link to="/login">¿Ya tenés cuenta? Iniciá sesión</Link>
                            &nbsp;|&nbsp;
                            <Link to="/registro/oferente">Registrarse como oferente</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RegistroEmpresa;
