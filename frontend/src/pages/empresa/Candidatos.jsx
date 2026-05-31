import { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { AppContext, apiFetch } from '../../AppProvider.jsx';
import Footer from '../../components/Footer.jsx';

export default function Candidatos() {
    const { puestoId } = useParams();
    const navigate = useNavigate();
    const { empresaState, setEmpresaState } = useContext(AppContext);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { cargarCandidatos(); }, [puestoId]);

    async function cargarCandidatos() {
        setCargando(true); setError(null);
        try {
            const res = await apiFetch(`/api/empresa/candidatos/${puestoId}`);
            if (!res.ok) throw new Error('No se pudo cargar la lista de candidatos');
            const data = await res.json();
            setEmpresaState(prev => ({ ...prev, candidatos: data }));
        } catch (e) { setError(e.message); }
        finally { setCargando(false); }
    }

    async function cerrarSesion() {
        await apiFetch('/api/auth/logout', { method: 'POST' });
        navigate('/login');
    }

    function colorBarra(pct) {
        if (pct >= 75) return '#2d8a4e';
        if (pct >= 40) return '#e6a817';
        return '#c0392b';
    }

    const { candidatos } = empresaState;

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
                            <button className="nav-link-login" onClick={cerrarSesion}>Salir</button>
                        </div>
                    </div>
                </nav>
            </section>

            <div className="contenedor-puestos" style={{ flex: 1 }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <h2 className="titulo-seccion">Candidatos para el Puesto</h2>
                    {candidatos?.puesto && (
                        <p style={{ color: '#555', marginBottom: '1rem' }}>
                            <strong>Puesto:</strong> {candidatos.puesto.descripcion}
                        </p>
                    )}
                    {error && <div className="alert-danger-box">{error}</div>}

                    {cargando ? (
                        <p className="text-muted">Cargando candidatos...</p>
                    ) : !candidatos?.candidatos?.length ? (
                        <p className="text-muted">No hay oferentes aprobados en el sistema aún.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="tabla-simple">
                                <thead>
                                    <tr>
                                        <th>Oferente</th>
                                        <th>Requisitos cumplidos</th>
                                        <th>% Coincidencia</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {candidatos.candidatos.map(r => (
                                        <tr key={r.oferente.id}>
                                            <td>{r.oferente.nombre} {r.oferente.apellido}</td>
                                            <td>{r.requisitosCumplidos} / {r.requisitosTotal}</td>
                                            <td>
                                                <div style={{ background: '#e0e0e0', borderRadius: 4, height: 20, width: 160, overflow: 'hidden' }}>
                                                    <div style={{
                                                        width: `${r.porcentaje}%`,
                                                        height: '100%',
                                                        background: colorBarra(r.porcentaje),
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: '#fff', fontSize: 12, fontWeight: 700
                                                    }}>
                                                        {r.porcentaje.toFixed(1)}%
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <Link to={`/empresa/candidatos/${puestoId}/oferente/${r.oferente.id}`}
                                                    className="btn-azul" style={{ fontSize: 12, padding: '4px 10px' }}>
                                                    Ver detalle
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <Link to="/empresa/puestos" className="btn-blanco mt-3" style={{ display: 'inline-block' }}>← Volver</Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
