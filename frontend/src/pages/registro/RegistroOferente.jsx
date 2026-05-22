import { Link } from 'react-router-dom';

function RegistroOferente() {
    return (
        <section className="container seccion-registro">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-7">
                    <div className="card p-4">
                        <h5 className="mb-4 fw-bold text-center">Completá tus datos personales</h5>

                        <form method="POST" action="http://localhost:8080/registro/oferente">
                            <div className="bloque-form">
                                <h6>Credenciales de acceso</h6>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nombre de usuario <span className="text-danger">*</span></label>
                                    <input type="text" name="username" className="form-control" placeholder="ej: juan_perez" required minLength="4"/>
                                    <div className="form-text">Este será tu usuario para iniciar sesión.</div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Contraseña <span className="text-danger">*</span></label>
                                    <input type="password" name="clave" className="form-control" placeholder="Mínimo 6 caracteres" required minLength="6"/>
                                </div>
                            </div>
                            <div className="bloque-form">
                                <h6>Datos personales</h6>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Nombre <span className="text-danger">*</span></label>
                                        <input type="text" name="nombre" className="form-control" placeholder="ej: Juan" required/>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Apellido <span className="text-danger">*</span></label>
                                        <input type="text" name="apellido" className="form-control" placeholder="ej: Pérez" required/>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nacionalidad <span className="text-danger">*</span></label>
                                    <input type="text" name="nacionalidad" className="form-control" placeholder="ej: Costarricense" required/>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Teléfono <span className="text-danger">*</span></label>
                                        <input type="tel" name="telefono" className="form-control" placeholder="ej: 8888-1234" required/>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Correo electrónico <span className="text-danger">*</span></label>
                                        <input type="email" name="correo" className="form-control" placeholder="juan@correo.com" required/>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Residencia <span className="text-danger">*</span></label>
                                    <input type="text" name="residencia" className="form-control" placeholder="ej: Heredia, Costa Rica" required/>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mt-2">Registrarme como oferente</button>
                            <p className="text-center text-muted small mt-3">
                                Tu cuenta quedará pendiente de aprobación por un administrador.<br/>
                                Los campos con <span className="text-danger">*</span> son obligatorios.
                            </p>
                        </form>

                        <hr/>
                        <div className="text-center small">
                            <Link to="/login">¿Ya tenés cuenta? Iniciá sesión</Link>
                            &nbsp;|&nbsp;
                            <Link to="/registro/empresa">Registrarse como empresa</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RegistroOferente;
