import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { AppContext, apiFetch } from '../../AppProvider.jsx';

export default function Login() {
    const { setAuthState } = useContext(AppContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', clave: '' });
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setCargando(true);
        setError(null);
        try {
            const body = new URLSearchParams({ username: form.username, clave: form.clave });
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Credenciales incorrectas.');
                setCargando(false);
                return;
            }
            setAuthState({ usuario: data, cargando: false, error: null });
            if (data.rol === 'ADM') navigate('/admin');
            else if (data.rol === 'EMP') navigate('/empresa');
            else if (data.rol === 'OFE') navigate('/oferente');
            else navigate('/');
        } catch {
            setError('Error de conexión con el servidor.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Bolsa de Empleo</h2>
                <p style={styles.subtitle}>Iniciá sesión en tu cuenta</p>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Usuario</label>
                    <input
                        style={styles.input}
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Tu nombre de usuario"
                        required
                    />
                    <label style={styles.label}>Contraseña</label>
                    <input
                        style={styles.input}
                        name="clave"
                        type="password"
                        value={form.clave}
                        onChange={handleChange}
                        placeholder="Tu contraseña"
                        required
                    />
                    <button style={styles.btn} type="submit" disabled={cargando}>
                        {cargando ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
                <div style={styles.links}>
                    <Link to="/registro/empresa">Registrar empresa</Link>
                    {' · '}
                    <Link to="/registro/oferente">Registrar oferente</Link>
                </div>
                <div style={styles.links}>
                    <Link to="/">← Volver al inicio</Link>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' },
    card: { background: '#fff', borderRadius: 12, padding: '2.5rem 2rem', width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' },
    title: { textAlign: 'center', color: '#1e3a8a', marginBottom: 4 },
    subtitle: { textAlign: 'center', color: '#64748b', marginBottom: '1.5rem' },
    error: { background: '#fee2e2', color: '#dc2626', borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1rem', fontSize: 14 },
    form: { display: 'flex', flexDirection: 'column', gap: 12 },
    label: { fontWeight: 600, color: '#374151', fontSize: 14 },
    input: { padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15, outline: 'none' },
    btn: { marginTop: 8, padding: '0.75rem', borderRadius: 8, background: '#1e3a8a', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' },
    links: { marginTop: '1rem', textAlign: 'center', fontSize: 14, color: '#475569' },
};
