import { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AppContext, apiFetch } from '../../AppProvider.jsx';
import Footer from '../../components/Footer.jsx';

export default function EditarEmpresa() {
    const { empresaState, setEmpresaState } = useContext(AppContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ nombre: '', localizacion: '', correo: '', telefono: '', descripcion: '' });
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiFetch('/api/empresa/perfil')
            .then(r => r.json())
            .then(data => {
                setEmpresaState(prev => ({ ...prev, perfil: data }));
                setForm({ nombre: data.nombre || '', localizacion: data.localizacion || '', correo: data.correo || '', telefono: data.telefono || '', descripcion: data.descripcion || '' });
            })
            .catch(() => {});
    }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault(); setError(null);
        const res = await apiFetch('/api/empresa/perfil', { method: 'PUT', body: JSON.stringify(form) });
        const data = await res.json();
        if (!res.ok) { setError(data.error); return; }
        setMensaje(data.mensaje);
        setTimeout(() => setMensaje(null), 3000);
    };

    async function cerrarSesion() {
        await apiFetch('/api/auth/logout', { method: 'POST' });
        navigate('/login');
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <section className="Inicio inicio-compact">
                <nav className="navbar-custom">
                    <div className="navbar-inner">
                        <a href="/" className="navbar-brand">
                            <img src="https://cdn-icons-png.flaticon.com/512/86/86155.png" alt="icono"
                                style={{ width: 36, height: 36, filter: 'brightness(0) invert(1)' }} />
                            <strong>Bolsa de Empleo</strong>
                        </a>
                        <div className="navbar-links">
                            <Link className="nav-link" to="/empresa">Dashboard</Link>
                            <Link className="nav-link" to="/empresa/puestos">Mis Puestos</Link>
                            <Link className="nav-link" to="/empresa/editar">Mi Perfil</Link>
                            <button className="nav-link-login" onClick={cerrarSesion}>Salir</button>
                        </div>
                    </div>
                </nav>
            </section>

            <div className="seccion-registro">
                <div className="registro-card-wrapper">
                    <div className="card card-registro">
                        <h2 className="titulo-form">Editar Perfil de Empresa</h2>
                        {error   && <div className="alert-danger-box">{error}</div>}
                        {mensaje && <div className="alert-success-box">{mensaje}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="bloque-form">
                                <p className="subtitulo-bloque">Datos de la empresa</p>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="form-label">Nombre</label>
                                        <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre de la empresa" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Localización</label>
                                        <input className="form-input" name="localizacion" value={form.localizacion} onChange={handleChange} placeholder="Ej: San José" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Correo</label>
                                        <input className="form-input" name="correo" value={form.correo} onChange={handleChange} placeholder="info@empresa.com" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Teléfono</label>
                                        <input className="form-input" name="telefono" value={form.telefono} onChange={handleChange} placeholder="88001122" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Descripción</label>
                                    <textarea className="form-input" name="descripcion" value={form.descripcion} onChange={handleChange} />
                                </div>
                            </div>
                            <button className="btn-primary w-100" type="submit">Guardar Cambios</button>
                        </form>
                        <hr />
                        <p className="text-center small"><Link to="/empresa">← Volver al Dashboard</Link></p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
