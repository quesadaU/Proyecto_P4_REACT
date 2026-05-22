import { useEffect, useContext, useState } from 'react';
import { AppContext } from '@/AppProvider';

const backend = 'http://localhost:8080/api';

function BuscaPuesto() {
    const { caracteristicasState, setCaracteristicasState } = useContext(AppContext);
    const [selectedIds, setSelectedIds] = useState([]);
    const [resultados, setResultados] = useState(null);

    useEffect(() => {
        if (caracteristicasState.caracteristicas.length === 0) handleListCaracteristicas();
    }, []);

    function handleListCaracteristicas() {
        (async () => {
            const response = await fetch(new Request(backend + '/caracteristicas', { method: 'GET' }));
            if (!response.ok) { alert('Error: ' + response.status); return; }
            setCaracteristicasState({ ...caracteristicasState, caracteristicas: await response.json() });
        })();
    }

    function handleToggle(id) {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }

    function handleBuscar(e) {
        e.preventDefault();
        if (selectedIds.length === 0) return;
        const params = selectedIds.map(id => `ids=${id}`).join('&');
        (async () => {
            const response = await fetch(new Request(backend + '/root/puestos/buscar?' + params, { method: 'GET' }));
            if (!response.ok) { alert('Error: ' + response.status); return; }
            setResultados(await response.json());
        })();
    }

    // Construir árbol padres → hijos igual que el controlador del backend
    const todas = caracteristicasState.caracteristicas;
    const padres = todas.filter(c => c.padre == null);
    const hijos = {};
    todas.forEach(c => {
        if (c.padre != null) {
            if (!hijos[c.padre.id]) hijos[c.padre.id] = [];
            hijos[c.padre.id].push(c);
        }
    });

    return (
        <>
            <section className="Inicio">
                <nav className="navbar navbar-expand-lg navbar-custom">
                    <div className="container">
                        <p>
                            <img src="https://cdn-icons-png.flaticon.com/512/86/86155.png"
                                 alt="icono"
                                 style={{width:'50px', height:'50px', filter:'brightness(0) invert(1)'}}/>
                            <strong> Bolsa de Empleo</strong>
                        </p>
                        <div className="navbar-nav ms-auto align-items-center">
                            <a className="nav-link" href="/">Inicio</a>
                            <a className="nav-link" href="/login">Login</a>
                        </div>
                    </div>
                </nav>
            </section>

            <div style={{display:'flex', gap:'2rem', padding:'1rem'}}>
                <div className="contenedor-filtros">
                    <h4>Buscar puestos por características</h4>
                    <form onSubmit={handleBuscar}>
                        <div className="seccion-scroll">
                            {padres.map(padre => (
                                <div className="grupo-categoria" key={padre.id}>
                                    <div className="categoria-padre">
                                        <input type="checkbox" id={'car-' + padre.id}
                                               checked={selectedIds.includes(padre.id)}
                                               onChange={() => handleToggle(padre.id)}/>
                                        <label htmlFor={'car-' + padre.id}>{padre.nombre}</label>
                                    </div>
                                    {hijos[padre.id] && (
                                        <div className="sub-opciones">
                                            {hijos[padre.id].map(hijo => (
                                                <div key={hijo.id}>
                                                    <div className="item">
                                                        <input type="checkbox" id={'car-' + hijo.id}
                                                               checked={selectedIds.includes(hijo.id)}
                                                               onChange={() => handleToggle(hijo.id)}/>
                                                        <label htmlFor={'car-' + hijo.id}>{hijo.nombre}</label>
                                                    </div>
                                                    {hijos[hijo.id] && (
                                                        <div className="sub-opciones ms-3">
                                                            {hijos[hijo.id].map(nieto => (
                                                                <div className="item" key={nieto.id}>
                                                                    <input type="checkbox" id={'car-' + nieto.id}
                                                                           checked={selectedIds.includes(nieto.id)}
                                                                           onChange={() => handleToggle(nieto.id)}/>
                                                                    <label htmlFor={'car-' + nieto.id}>{nieto.nombre}</label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {padres.length === 0 && (
                                <p className="text-muted small">No hay características registradas aún.</p>
                            )}
                        </div>
                        <div className="seccion-botones">
                            <button type="submit" className="btn-azul">Buscar</button>
                            <button type="reset" className="btn-blanco" onClick={() => setSelectedIds([])}>Limpiar</button>
                        </div>
                    </form>
                </div>

                <div className="MostrarPuestos" style={{flex:1}}>
                    {resultados === null && (
                        <p style={{textAlign:'center', padding:'2rem', color:'#666'}}>
                            Seleccioná una o más características y presioná <strong>Buscar</strong>.
                        </p>
                    )}
                    {resultados !== null && resultados.length === 0 && (
                        <p style={{textAlign:'center', padding:'2rem', color:'#666'}}>
                            No se encontraron puestos con las características seleccionadas.
                        </p>
                    )}
                    {resultados !== null && resultados.length > 0 && (
                        <div className="grid-puestos">
                            {resultados.map(p => (
                                <div className="card-puesto" key={p.id}>
                                    <h3 style={{fontWeight:'bold'}}>
                                        {p.empresa != null ? p.empresa.nombre : 'Empresa'}
                                    </h3>
                                    <p className="titulo">{p.descripcion}</p>
                                    <p className="salario">₡ {p.salario}</p>
                                    <div className="detalle">
                                        <p><strong>Tipo:</strong> {p.tipo}</p>
                                        <p><strong>Estado:</strong> {p.estado}</p>
                                        <p><strong>Fecha:</strong> {p.fecha}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default BuscaPuesto;
