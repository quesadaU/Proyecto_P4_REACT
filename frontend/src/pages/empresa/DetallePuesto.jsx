import { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { AppContext, apiFetch } from '../../AppProvider.jsx';
import Footer from '../../components/Footer.jsx';

export default function DetallePuesto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { empresaState, setEmpresaState } = useContext(AppContext);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(null);
    const [form, setForm] = useState({ caracteristicaId: '', nivel: '' });

    useEffect(() => { cargarDetalle(); }, [id]);

    async function cargarDetalle() {
        setCargando(true); setError(null);
        try {
            const res = await apiFetch(`/api/empresa/puestos/${id}`);
            if (!res.ok) throw new Error('Puesto no encontrado');
            const data = await res.json();
            setEmpresaState(prev => ({ ...prev, puestoActual: data }));
        } catch (e) { setError(e.message); }
        finally { setCargando(false); }
    }

    async function agregarHabilidad(e) {
        e.preventDefault(); setError(null); setExito(null);
        try {
            const res = await apiFetch(`/api/empresa/puestos/${id}/habilidades`, {
                method: 'POST',
                body: JSON.stringify({ caracteristicaId: parseInt(form.caracteristicaId), nivel: parseInt(form.nivel) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setExito('Habilidad agregada.');
            setForm({ caracteristicaId: '', nivel: '' });
            cargarDetalle();
        } catch (e) { setError(e.message); }
    }

    async function eliminarHabilidad(habId) {
        if (!confirm('¿Eliminar esta habilidad?')) return;
        setError(null);
        try {
            const res = await apiFetch(`/api/empresa/puestos/habilidades/${habId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar');
            setExito('Habilidad eliminada.');
            cargarDetalle();
        } catch (e) { setError(e.message); }
    }

    async function cerrarSesion() {
        await apiFetch('/api/auth/logout', { method: 'POST' });
        navigate('/login');
    }

    const { puestoActual } = empresaState;

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
                            <button className="nav-link-login" onClick={cerrarSesion}>Salir</button>
                        </div>
                    </div>
                </nav>
            </section>

            <div className="contenedor-puestos" style={{ flex: 1 }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <h2 className="titulo-seccion">Habilidades del Puesto</h2>
                    {cargando ? (
                        <p className="text-muted">Cargando...</p>
                    ) : (
                        <>
                            {puestoActual?.puesto && (
                                <p style={{ color: '#555', marginBottom: '1rem' }}>{puestoActual.puesto.descripcion}</p>
                            )}
                            {error  && <div className="alert-danger-box">{error}</div>}
                            {exito  && <div className="alert-success-box">{exito}</div>}

                            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                {/* Habilidades actuales */}
                                <div style={{ flex: 2, minWidth: 280 }}>
                                    <h5 style={{ color: 'var(--azul-oscuro)', marginBottom: '1rem' }}>Características requeridas</h5>
                                    {!puestoActual?.habilidades?.length ? (
                                        <p className="text-muted">Aún no se han agregado características a este puesto.</p>
                                    ) : (
                                        <table className="tabla-simple">
                                            <thead><tr><th>Característica</th><th>Nivel requerido</th><th>Acción</th></tr></thead>
                                            <tbody>
                                                {puestoActual.habilidades.map(h => (
                                                    <tr key={h.id}>
                                                        <td>{h.habilidad?.nombre}</td>
                                                        <td>{h.nivel}</td>
                                                        <td>
                                                            <button className="btn-aprobar-simple"
                                                                style={{ background: '#c0392b' }}
                                                                onClick={() => eliminarHabilidad(h.id)}>
                                                                Eliminar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {/* Formulario agregar */}
                                <div style={{ flex: 1, minWidth: 240 }}>
                                    <div className="card" style={{ borderTopColor: 'var(--dorado)' }}>
                                        <h5 style={{ color: 'var(--azul-oscuro)', fontWeight: 'bold', marginBottom: '1rem' }}>
                                            Agregar característica
                                        </h5>
                                        <form onSubmit={agregarHabilidad}>
                                            <div className="form-group">
                                                <label className="form-label">Característica</label>
                                                <select className="form-input" value={form.caracteristicaId}
                                                    onChange={e => setForm(prev => ({ ...prev, caracteristicaId: e.target.value }))} required>
                                                    <option value="">-- Seleccioná --</option>
                                                    {puestoActual?.caracteristicas?.map(c => (
                                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Nivel requerido (1–5)</label>
                                                <input className="form-input" type="number" min={1} max={5}
                                                    value={form.nivel}
                                                    onChange={e => setForm(prev => ({ ...prev, nivel: e.target.value }))} required />
                                            </div>
                                            <button className="btn-primary w-100" type="submit">Agregar</button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <Link to="/empresa/puestos" className="btn-blanco mt-3" style={{ display: 'inline-block' }}>
                                ← Volver a mis puestos
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
