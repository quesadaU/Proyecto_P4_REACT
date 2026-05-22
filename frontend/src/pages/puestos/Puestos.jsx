import { useEffect, useContext } from 'react';
import { AppContext } from '@/AppProvider';

const backend = 'http://localhost:8080/api';

function Puestos() {
    const { puestosState, setPuestosState } = useContext(AppContext);

    useEffect(() => {
        if (puestosState.puestos.length === 0) handleList();
    }, []);

    function handleList() {
        const request = new Request(backend + '/puestos', { method: 'GET' });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) { alert('Error: ' + response.status); return; }
            setPuestosState({ ...puestosState, puestos: await response.json(), puesto: { id: '', descripcion: '', salario: 0, tipo: 'PUBLICO', estado: 'ACTIVO', fecha: '' } });
        })();
    }

    function handleFieldChange(event) {
        const { name, value } = event.target;
        setPuestosState({ ...puestosState, puesto: { ...puestosState.puesto, [name]: value } });
    }

    function handleEdit(entity) {
        setPuestosState({ ...puestosState, puesto: entity });
    }

    function handleClear() {
        setPuestosState({ ...puestosState, puesto: { id: '', descripcion: '', salario: 0, tipo: 'PUBLICO', estado: 'ACTIVO', fecha: '' } });
    }

    function handleSave(event) {
        event.preventDefault();
        const request = new Request(backend + '/puestos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(puestosState.puesto) });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) { alert('Error: ' + response.status); return; }
            handleList();
        })();
    }

    function handleDelete(entity) {
        const request = new Request(backend + '/puestos/' + entity.id, { method: 'DELETE' });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) { alert('Error: ' + response.status); return; }
            handleList();
        })();
    }

    return (
        <>
            <Edit entity={puestosState.puesto} handleFieldChange={handleFieldChange} handleSave={handleSave} handleClear={handleClear} />
            <hr />
            <List list={puestosState.puestos} handleEdit={handleEdit} handleDelete={handleDelete} />
        </>
    );
}

function Edit({ entity, handleFieldChange, handleSave, handleClear }) {
    return (
        <div style={{ padding: '1rem' }}>
            <form onSubmit={handleSave}>
                <table border="0" cellPadding="3" cellSpacing="4">
                    <tbody>
                        <tr>
                            <td><strong>Descripción</strong></td>
                            <td><input type="text" name="descripcion" value={entity.descripcion} required onChange={handleFieldChange} /></td>
                        </tr>
                        <tr>
                            <td><strong>Salario</strong></td>
                            <td><input type="number" name="salario" value={entity.salario} required onChange={handleFieldChange} /></td>
                        </tr>
                        <tr>
                            <td><strong>Tipo</strong></td>
                            <td>
                                <select name="tipo" value={entity.tipo} onChange={handleFieldChange}>
                                    <option value="PUBLICO">Público</option>
                                    <option value="PRIVADO">Privado</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Estado</strong></td>
                            <td>
                                <select name="estado" value={entity.estado} onChange={handleFieldChange}>
                                    <option value="ACTIVO">Activo</option>
                                    <option value="INACTIVO">Inactivo</option>
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
                    <tr><th>ID</th><th>Descripción</th><th>Salario</th><th>Tipo</th><th>Estado</th><th>Fecha</th><th>...</th><th>...</th></tr>
                </thead>
                <tbody>
                    {list.map(p => <Item puesto={p} key={p.id} handleEdit={handleEdit} handleDelete={handleDelete} />)}
                </tbody>
            </table>
        </div>
    );
}

function Item({ puesto, handleEdit, handleDelete }) {
    return (
        <tr>
            <td>{puesto.id}</td>
            <td>{puesto.descripcion}</td>
            <td>₡ {puesto.salario}</td>
            <td>{puesto.tipo}</td>
            <td>{puesto.estado}</td>
            <td>{puesto.fecha}</td>
            <td><button onClick={() => handleEdit(puesto)}>✏️</button></td>
            <td><button onClick={() => handleDelete(puesto)}>🗑️</button></td>
        </tr>
    );
}

export default Puestos;
