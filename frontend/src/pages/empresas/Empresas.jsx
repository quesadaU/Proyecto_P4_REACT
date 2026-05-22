import { useEffect, useContext } from 'react';
import { AppContext } from '@/AppProvider';

const backend = 'http://localhost:8080/api';

function Empresas() {
    const { empresasState, setEmpresasState } = useContext(AppContext);

    useEffect(() => {
        if (empresasState.empresas.length === 0) handleList();
    }, []);

    function handleList() {
        const request = new Request(backend + '/empresas', { method: 'GET' });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) { alert('Error: ' + response.status); return; }
            setEmpresasState({ ...empresasState, empresas: await response.json(), empresa: { id: '', nombre: '', localizacion: '', correo: '', telefono: '', descripcion: '' } });
        })();
    }

    function handleFieldChange(event) {
        const { name, value } = event.target;
        setEmpresasState({ ...empresasState, empresa: { ...empresasState.empresa, [name]: value } });
    }

    function handleEdit(entity) {
        setEmpresasState({ ...empresasState, empresa: entity });
    }

    function handleClear() {
        setEmpresasState({ ...empresasState, empresa: { id: '', nombre: '', localizacion: '', correo: '', telefono: '', descripcion: '' } });
    }

    function handleSave(event) {
        event.preventDefault();
        const request = new Request(backend + '/empresas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(empresasState.empresa) });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) { alert('Error: ' + response.status); return; }
            handleList();
        })();
    }

    function handleDelete(entity) {
        const request = new Request(backend + '/empresas/' + entity.id, { method: 'DELETE' });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) { alert('Error: ' + response.status); return; }
            handleList();
        })();
    }

    return (
        <>
            <Edit entity={empresasState.empresa} handleFieldChange={handleFieldChange} handleSave={handleSave} handleClear={handleClear} />
            <hr />
            <List list={empresasState.empresas} handleEdit={handleEdit} handleDelete={handleDelete} />
        </>
    );
}

function Edit({ entity, handleFieldChange, handleSave, handleClear }) {
    return (
        <div style={{ padding: '1rem' }}>
            <form onSubmit={handleSave}>
                <table border="0" cellPadding="3" cellSpacing="4">
                    <tbody>
                        {[['nombre','Nombre'],['localizacion','Localización'],['correo','Correo'],['telefono','Teléfono'],['descripcion','Descripción']].map(([field, label]) => (
                            <tr key={field}>
                                <td><strong>{label}</strong></td>
                                <td><input type="text" name={field} value={entity[field]} required onChange={handleFieldChange} /></td>
                            </tr>
                        ))}
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
                    <tr><th>ID</th><th>Nombre</th><th>Localización</th><th>Correo</th><th>Teléfono</th><th>Aprobada</th><th>...</th><th>...</th></tr>
                </thead>
                <tbody>
                    {list.map(e => <Item empresa={e} key={e.id} handleEdit={handleEdit} handleDelete={handleDelete} />)}
                </tbody>
            </table>
        </div>
    );
}

function Item({ empresa, handleEdit, handleDelete }) {
    return (
        <tr>
            <td>{empresa.id}</td>
            <td>{empresa.nombre}</td>
            <td>{empresa.localizacion}</td>
            <td>{empresa.correo}</td>
            <td>{empresa.telefono}</td>
            <td>{empresa.aprobada ? '✅' : '⏳'}</td>
            <td><button onClick={() => handleEdit(empresa)}>✏️</button></td>
            <td><button onClick={() => handleDelete(empresa)}>🗑️</button></td>
        </tr>
    );
}

export default Empresas;
