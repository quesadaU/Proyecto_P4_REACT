import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function Login() {
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();

    async function handleSubmit(e) {
        e.preventDefault();
        const username = e.target.username.value;
        const clave = e.target.clave.value;

        if (username.trim() === '' || clave.trim() === '') {
            setError('El usuario y la contraseña no pueden estar en blanco o contener solo espacios.');
            return;
        }

        const body = new URLSearchParams({ username, clave });
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
            redirect: 'manual',
        });

        if (response.type === 'opaqueredirect' || response.ok || response.status === 302) {
            // Login exitoso — consultar el rol para redirigir en React
            const me = await fetch('http://localhost:8080/api/me', { credentials: 'include' });
            if (me.ok) {
                const data = await me.json();
                if (data.rol === 'ROLE_ADM') window.location.href = 'http://localhost:8080/DashboardAdministrador';
                else if (data.rol === 'ROLE_EMP') window.location.href = 'http://localhost:8080/DashboardEmpresa';
                else if (data.rol === 'ROLE_OFE') window.location.href = 'http://localhost:8080/DashboardOferente';
                else window.location.href = '/';
            }
        } else {
            setError('Usuario o contraseña incorrectos.');
        }
    }

    return (
        <section className="container login-rapida">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card p-4">
                        <h5 className="mb-3 fw-bold text-center">Ingresá tus datos</h5>

                        {searchParams.get('error') && (
                            <div className="alert alert-danger">Usuario o contraseña incorrectos.</div>
                        )}
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Usuario</label>
                                <input type="text" name="username" className="form-control"
                                       placeholder="empresa-oferente" required/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Contraseña</label>
                                <input type="password" name="clave" className="form-control"
                                       placeholder="••••••••" required/>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mt-2">Entrar</button>
                        </form>

                        <hr/>
                        <div className="text-center small">
                            <Link to="/registro/empresa">Registrar empresa</Link>
                            &nbsp;|&nbsp;
                            <Link to="/registro/oferente">Registrar oferente</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
