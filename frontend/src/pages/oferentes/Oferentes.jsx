import { useEffect, useContext } from 'react';
import { AppContext } from '@/AppProvider';

const backend = 'http://localhost:8080/api';

function Oferentes() {
    const { oferentesState, setOferentesState } = useContext(AppContext);

    useEffect(() => {
        if (oferentesState.oferentes.length === 0) handleList();
    }, []);

    function handleList() {
        const request = new Request(backend + '/oferentes', { method: 'GET' });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) { alert('Error: ' + response.status); return; }
            setOferentesState({ ...oferentesState, oferentes: await response.json(), oferente: { id: '', nombre: '', apellido: '', nacionalidad: '', telefono: '', correo: '', residencia: '' } });
        })();
    }

    function handleFieldChange(event) {
        const { name, value } = event.target;
        setOferentesState({ ...oferentesState, oferente: { ...oferentesState.oferente, [name]: value } });
    }

    function handleEdit(entity) {
        setOferentesState({ ...oferentesState, oferente: entity });
    }

    function handleClear() {
        setOferentesState({ ...oferentesState, oferente: { id: '', nombre: '', apellido: '', nacionalidad: '', telefono: '', correo: '', residencia: '' } });
    }

    function handleSave(event) {
        event.preventDefault();
        const request = new Request(backend + '/oferentes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(oferentesState.oferente) });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) { alert('Error: ' + response.status); return; }
            handleList();
        })();
    }

    function handleDelete(entity) {
        const request = new Request(backend + '/oferentes/' + entity.id, { method: 'DELETE' });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) { alert('Error: ' + response.status); return; }
            handleList();
        })();
    }

    return (
        <>
            <Edit entity={oferentesState.oferente} handleFieldChange={handleFieldChange} handleSave={handleSave} handleClear={handleClear} />
            <hr />
            <List list={oferentesState.oferentes} handleEdit={handleEdit} handleDelete={handleDelete} />
        </>
    );
}

function Edit({ entity, handleFieldChange, handleSave, handleClear }) {
    return (
        <div style={{ padding: '1rem' }}>
            <form onSubmit={handleSave}>
                <table border="0" cellPadding="3" cellSpacing="4">
                    <tbody>
                        {[['nombre','Nombre'],['apellido','Apellido'],['nacionalidad','Nacionalidad'],['telefono','Teléfono'],['correo','Correo'],['residencia','Residencia']].map(([field, label]) => (
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
                    <tr><th>ID</th><th>Nombre</th><th>Apellido</th><th>Correo</th><th>Aprobado</th><th>...</th><th>...</th></tr>
                </thead>
                <tbody>
                    {list.map(o => <Item oferente={o} key={o.id} handleEdit={handleEdit} handleDelete={handleDelete} />)}
                </tbody>
            </table>
        </div>
    );
}

function Item({ oferente, handleEdit, handleDelete }) {
    return (
        <tr>
            <td>{oferente.id}</td>
            <td>{oferente.nombre}</td>
            <td>{oferente.apellido}</td>
            <td>{oferente.correo}</td>
            <td>{oferente.aprobado ? '✅' : '⏳'}</td>
            <td><button onClick={() => handleEdit(oferente)}>✏️</button></td>
            <td><button onClick={() => handleDelete(oferente)}>🗑️</button></td>
        </tr>
    );
}

export default Oferentes;
