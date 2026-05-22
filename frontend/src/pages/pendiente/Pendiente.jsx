import { useSearchParams } from 'react-router-dom';

function Pendiente() {
    const [searchParams] = useSearchParams();
    const tipo = searchParams.get('tipo');

    return (
        <div className="container mt-5 text-center" style={{maxWidth:'600px'}}>
            <h2 className="fw-bold">Tu cuenta está pendiente de aprobación</h2>
            <p className="text-muted mt-3">
                Tu registro fue recibido correctamente. Un administrador debe revisar
                y aprobar tu cuenta antes de que puedas acceder al sistema.
            </p>
            {tipo === 'EMP' && (
                <div className="alert alert-warning mt-4">
                    <strong>Cuenta de empresa</strong> — en espera de aprobación administrativa.
                </div>
            )}
            {tipo === 'OFE' && (
                <div className="alert alert-warning mt-4">
                    <strong>Cuenta de oferente</strong> — en espera de aprobación administrativa.
                </div>
            )}
            <p className="text-muted small mt-3">
                Si ya pasó tiempo y no has recibido respuesta, podés contactar al administrador del sistema.
            </p>
            <a href="http://localhost:8080/logout" className="btn btn-secondary mt-3">Volver al inicio</a>
        </div>
    );
}

export default Pendiente;
