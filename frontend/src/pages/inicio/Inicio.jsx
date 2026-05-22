import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '@/AppProvider';

const backend = 'http://localhost:8080/api';

function Inicio() {
    const { puestosState, setPuestosState } = useContext(AppContext);

    useEffect(() => {
        if (puestosState.puestos.length === 0) handleList();
    }, []);

    function handleList() {
        (async () => {
            const response = await fetch(new Request(backend + '/root/puestos/recientes', { method: 'GET' }));
            if (!response.ok) { alert('Error: ' + response.status); return; }
            setPuestosState({ ...puestosState, puestos: await response.json() });
        })();
    }

    return (
        <>
            {/* Búsqueda rápida — igual que viewpublic.html */}
            <section className="container busqueda-rapida">
                <div className="card p-4">
                    <h5 className="mb-3 fw-bold">Búsqueda rápida de puestos</h5>
                    <div className="row g-3">
                        <div className="col-md-8">
                            <input type="text" className="form-control"
                                   placeholder="Ej: Desarrollador Java, Soporte Técnico..."/>
                        </div>
                        <div className="col-md-4">
                            <Link to="/buscar" className="btn btn-primary w-50">Buscar</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Últimos 5 puestos públicos */}
            <section className="contenedor-puestos">
                <h2>Últimos puestos públicos</h2>

                {puestosState.puestos.length === 0 && (
                    <p className="text-muted text-center py-4">
                        Aún no hay puestos públicos registrados. ¡Volvé pronto!
                    </p>
                )}

                {puestosState.puestos.length > 0 && (
                    <div className="grid-puestos">
                        {puestosState.puestos.map(p => (
                            <div className="card-puesto" key={p.id}>
                                <h3 style={{fontWeight:'bold'}}>
                                    {p.empresa != null ? p.empresa.nombre : 'Empresa'}
                                </h3>
                                <p className="titulo">{p.descripcion}</p>
                                <p className="salario">₡ {p.salario}</p>
                                <button className="btn-detalle">Ver detalle</button>
                                <div className="detalle">
                                    <p><strong>Tipo:</strong> {p.tipo}</p>
                                    <p><strong>Estado:</strong> {p.estado}</p>
                                    <p><strong>Fecha:</strong> {p.fecha}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default Inicio;
