import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AppContext, apiFetch } from '../../AppProvider.jsx';
import Footer from '../../components/Footer.jsx';

export default function DashboardEmpresa() {
    const { authState, setAuthState, empresaState, setEmpresaState } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        apiFetch('/api/empresa/perfil')
            .then(r => { if (r.status === 403) navigate('/pendiente'); return r.json(); })
            .then(data => setEmpresaState(prev => ({ ...prev, perfil: data })))
            .catch(() => {});
    }, []);

    const cerrarSesion = async () => {
        await apiFetch('/api/auth/logout', { method: 'POST' });
        setAuthState({ usuario: null, cargando: false, error: null });
        navigate('/login');
    };

    const { perfil } = empresaState;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <section className="Inicio">
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
                            <Link className="nav-link" to="/empresa/puestos/nuevo">Nuevo Puesto</Link>
                            <Link className="nav-link" to="/empresa/editar">Mi Perfil</Link>
                            {authState.usuario && (
                                <span className="nav-link" style={{ color: 'var(--dorado)', fontWeight: 'bold' }}>
                                    {authState.usuario.username}
                                </span>
                            )}
                            <button className="nav-link-login" onClick={cerrarSesion}>Salir</button>
                        </div>
                    </div>
                </nav>
                <div className="hero-content" style={{ padding: '30px 20px 40px' }}>
                    <p className="hero-eyebrow">Panel de Empresa</p>
                    <h1 className="hero-title" style={{ fontSize: 32 }}>
                        {perfil?.nombre ?? authState.usuario?.username}
                    </h1>
                </div>
            </section>

            <div className="contenedor-puestos" style={{ flex: 1 }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    {perfil && (
                        <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                            <span>📍 {perfil.localizacion}</span>
                            <span>📧 {perfil.correo}</span>
                            <span>📞 {perfil.telefono}</span>
                            {perfil.descripcion && <span>📄 {perfil.descripcion}</span>}
                        </div>
                    )}

                    <h2 className="titulo-seccion">Acciones</h2>
                    <div className="grid-puestos" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                        {[
                            { to: '/empresa/puestos',       icon: '💼', label: 'Mis Puestos' },
                            { to: '/empresa/puestos/nuevo', icon: '➕', label: 'Nuevo Puesto' },
                            { to: '/empresa/editar',        icon: '✏️', label: 'Editar Perfil' },
                        ].map(m => (
                            <Link key={m.to} to={m.to} style={{ textDecoration: 'none' }}>
                                <div className="card-puesto" style={{ textAlign: 'center', padding: '2rem 1rem', cursor: 'pointer' }}>
                                    <div style={{ fontSize: 36, marginBottom: 10 }}>{m.icon}</div>
                                    <p style={{ fontWeight: 700, color: 'var(--azul-oscuro)', margin: 0 }}>{m.label}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
