import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { AppContext, apiFetch } from '../../AppProvider.jsx';
import Footer from '../../components/Footer.jsx';

export default function NuevoPuesto() {
    const navigate = useNavigate();
    const { setEmpresaState } = useContext(AppContext);
    const [form, setForm] = useState({ descripcion: '', salario: '', tipo: 'PUBLICO' });
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); }

    async function handleSubmit(e) {
        e.preventDefault(); setError(null); setCargando(true);
        try {
            const res = await apiFetch('/api/empresa/puestos', {
                method: 'POST',
                body: JSON.stringify({ descripcion: form.descripcion, salario: parseInt(form.salario), tipo: form.tipo }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al crear el puesto');
            setEmpresaState(prev => ({ ...prev, puestos: [...prev.puestos, data] }));
            navigate('/empresa/puestos', { state: { exito: true } });
        } catch (e) { setError(e.message); }
        finally { setCargando(false); }
    }

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
                            <Link className="nav-link" to="/empresa/puestos/nuevo">Publicar Puesto</Link>
                            <Link className="nav-link" to="/empresa/editar">Mi Perfil</Link>
                            <button className="nav-link-login" onClick={cerrarSesion}>Salir</button>
                        </div>
                    </div>
                </nav>
            </section>

            <div className="seccion-registro" style={{ alignItems: 'flex-start' }}>
                <div className="registro-card-wrapper">
                    <div className="card card-registro">
                        <h2 className="titulo-form">Publicar Nuevo Puesto</h2>
                        {error && <div className="alert-danger-box">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="bloque-form">
                                <p className="subtitulo-bloque">Datos del Puesto</p>
                                <div className="form-group">
                                    <label className="form-label">Descripción <span className="req">*</span></label>
                                    <textarea className="form-input" name="descripcion" rows={3}
                                        placeholder="ej: Desarrollador Java Backend..." value={form.descripcion}
                                        onChange={handleChange} required />
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="form-label">Salario (₡) <span className="req">*</span></label>
                                        <input className="form-input" type="number" name="salario"
                                            placeholder="ej: 1500000" min={0} value={form.salario}
                                            onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tipo <span className="req">*</span></label>
                                        <select className="form-input" name="tipo" value={form.tipo} onChange={handleChange} required>
                                            <option value="PUBLICO">Público — visible para todos</option>
                                            <option value="PRIVADO">Privado — solo oferentes registrados</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button className="btn-primary w-100" type="submit" disabled={cargando}>
                                {cargando ? 'Creando...' : 'Crear Puesto'}
                            </button>
                        </form>

                        <hr />
                        <p className="text-center small" style={{ color: '#666' }}>
                            Después de crear el puesto podrás agregarle las características requeridas
                            desde la vista <strong>Habilidades</strong> en "Mis puestos".
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
