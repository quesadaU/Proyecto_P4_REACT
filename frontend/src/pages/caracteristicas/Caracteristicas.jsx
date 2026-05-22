import { useEffect, useContext } from 'react';
import { AppContext } from '@/AppProvider';

const backend = 'http://localhost:8080/api';

function Caracteristicas() {
    const { caracteristicasState, setCaracteristicasState } = useContext(AppContext);

    useEffect(() => {
        if (caracteristicasState.caracteristicas.length === 0) handleList();
    }, []);

    function handleList() {
        const request = new Request(backend + '/caracteristicas', { method: 'GET' });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) { alert('Error: ' + response.status); return; }
            setCaracteristicasState({ ...caracteristicasState, caracteristicas: await response.json(), caracteristica: { id: '', nombre: '', padre: null } });
        })();
    }

    function handleFieldChange(event) {
        const { name, value } = event.target;
        setCaracteristicasState({ ...caracteristicasState, caracteristica: { ...caracteristicasState.caracteristica, [name]: value } });
    }

    function handleEdit(entity) {
        setCaracteristicasState({ ...caracteristicasState, caracteristica: entity });
    }

    function handleClear() {
        setCaracteristicasState({ ...caracteristicasState, caracteristica: { id: '', nombre: '', padre: null } });
    }

    function handleSave(event) {
        event.preventDefault();
        const { nombre, padre } = caracteristicasState.caracteristica;
        const params = new URLSearchParams({ nombre });
        if (padre?.id) params.append('padreId', padre.id);
        const request = new Request(backend + '/caracteristicas?' + params.toString(), { method: 'POST' });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) { alert('Error: ' + response.status); return; }
            handleList();
        })();
    }

    function handleDelete(entity) {
        const request = new Request(backend + '/caracteristicas/' + entity.id, { method: 'DELETE' });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) { alert('Error: ' + response.status); return; }
            handleList();
        })();
    }

    return (
        <>
            <Edit
                entity={caracteristicasState.caracteristica}
                todas={caracteristicasState.caracteristicas}
                handleFieldChange={handleFieldChange}
                handleSave={handleSave}
                handleClear={handleClear}
                setCaracteristicasState={setCaracteristicasState}
                caracteristicasState={caracteristicasState}
            />
            <hr />
            <List list={caracteristicasState.caracteristicas} handleEdit={handleEdit} handleDelete={handleDelete} />
        </>
    );
}

function Edit({ entity, todas, handleFieldChange, handleSave, handleClear, setCaracteristicasState, caracteristicasState }) {
    function handlePadreChange(e) {
        const padreId = parseInt(e.target.value);
        const padre = todas.find(c => c.id === padreId) || null;
        setCaracteristicasState({ ...caracteristicasState, caracteristica: { ...entity, padre } });
    }

    return (
        <div style={{ padding: '1rem' }}>
            <form onSubmit={handleSave}>
                <table border="0" cellPadding="3" cellSpacing="4">
                    <tbody>
                        <tr>
                            <td><strong>Nombre</strong></td>
                            <td><input type="text" name="nombre" value={entity.nombre} required onChange={handleFieldChange} /></td>
                        </tr>
                        <tr>
                            <td><strong>Padre</strong></td>
                            <td>
                                <select value={entity.padre?.id ?? ''} onChange={handlePadreChange}>
                                    <option value="">(sin padre — raíz)</option>
                                    {todas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <input type="submit" value="Guardar" /> &nbsp;
                                <input type="button" value="Limpiar" onClick={handleClear} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

function List({ list, handleEdit, handleDelete }) {
    return (
        <div style={{ padding: '1rem' }}>
            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr><th>ID</th><th>Nombre</th><th>Padre</th><th>...</th><th>...</th></tr>
                </thead>
                <tbody>
                    {list.map(c => <Item caracteristica={c} key={c.id} handleEdit={handleEdit} handleDelete={handleDelete} />)}
                </tbody>
            </table>
        </div>
    );
}

function Item({ caracteristica, handleEdit, handleDelete }) {
    return (
        <tr>
            <td>{caracteristica.id}</td>
            <td>{caracteristica.nombre}</td>
            <td>{caracteristica.padre?.nombre ?? '—'}</td>
            <td><button onClick={() => handleEdit(caracteristica)}>✏️</button></td>
            <td><button onClick={() => handleDelete(caracteristica)}>🗑️</button></td>
        </tr>
    );
}

export default Caracteristicas;
