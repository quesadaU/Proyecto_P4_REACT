import { useEffect, useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { AppContext, apiFetch } from '../../AppProvider.jsx';
import Footer from '../../components/Footer.jsx';

export default function MisPuestos() {
    const { empresaState, setEmpresaState, authState } = useContext(AppContext);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(null);
    const navigate = useNavigate();

    useEffect(() => { cargarPuestos(); }, []);

    async function cargarPuestos() {
        setCargando(true);
        try {
            const res = await apiFetch('/api/empresa/puestos');
            if (res.status === 403) { navigate('/pendiente'); return; }
            if (!res.ok) throw new Error('Error al cargar puestos');
            const data = await res.json();
            setEmpresaState(prev => ({ ...prev, puestos: data }));
        } catch (e) { setError(e.message); }
        finally { setCargando(false); }
    }

    async function desactivarPuesto(id) {
        if (!confirm('¿Desactivar este puesto?')) return;
        try {
            const res = await apiFetch(`/api/empresa/puestos/${id}/desactivar`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setExito('Puesto desactivado correctamente.');
            cargarPuestos();
        } catch (e) { setError(e.message); }
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

            <div className="contenedor-puestos" style={{ flex: 1 }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    {exito && <div className="alert-success-box">{exito}</div>}
                    {error  && <div className="alert-danger-box">{error}</div>}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className="titulo-seccion" style={{ margin: 0 }}>Mis Puestos</h2>
                        <Link to="/empresa/puestos/nuevo" className="btn-primary">+ Publicar Puesto</Link>
                    </div>

                    {cargando ? (
                        <p className="text-muted">Cargando puestos...</p>
                    ) : empresaState.puestos.length === 0 ? (
                        <p className="text-muted">Aún no tenés puestos publicados.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="tabla-simple">
                                <thead>
                                    <tr>
                                        <th>ID</th><th>Descripción</th><th>Salario</th>
                                        <th>Tipo</th><th>Estado</th><th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {empresaState.puestos.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.descripcion}</td>
                                            <td>₡ {p.salario?.toLocaleString()}</td>
                                            <td>{p.tipo}</td>
                                            <td>
                                                <span style={{
                                                    background: p.estado === 'ACTIVO' ? '#d4edda' : '#e2e3e5',
                                                    color:      p.estado === 'ACTIVO' ? '#155724' : '#383d41',
                                                    borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 700
                                                }}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td style={{ display: 'flex', gap: 6 }}>
                                                {p.estado === 'ACTIVO' && (
                                                    <button className="btn-blanco" style={{ fontSize: 12, padding: '4px 10px' }}
                                                        onClick={() => desactivarPuesto(p.id)}>
                                                        Desactivar
                                                    </button>
                                                )}
                                                <Link to={`/empresa/candidatos/${p.id}`} className="btn-azul" style={{ fontSize: 12, padding: '4px 10px' }}>
                                                    Candidatos
                                                </Link>
                                                <Link to={`/empresa/puestos/${p.id}`} className="btn-blanco" style={{ fontSize: 12, padding: '4px 10px' }}>
                                                    Habilidades
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
