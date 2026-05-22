import { createContext, useState } from 'react';

const AppContext = createContext();

function AppProvider(props) {
    const [puestosState, setPuestosState] = useState({
        puestos: [],
        puesto: { id: '', descripcion: '', salario: 0, tipo: 'PUBLICO', estado: 'ACTIVO', fecha: '' },
    });
    const [empresasState, setEmpresasState] = useState({
        empresas: [],
        empresa: { id: '', nombre: '', localizacion: '', correo: '', telefono: '', descripcion: '' },
    });
    const [oferentesState, setOferentesState] = useState({
        oferentes: [],
        oferente: { id: '', nombre: '', apellido: '', nacionalidad: '', telefono: '', correo: '', residencia: '' },
    });
    const [caracteristicasState, setCaracteristicasState] = useState({
        caracteristicas: [],
        caracteristica: { id: '', nombre: '', padre: null },
    });

    return (
        <AppContext.Provider value={{
            puestosState, setPuestosState,
            empresasState, setEmpresasState,
            oferentesState, setOferentesState,
            caracteristicasState, setCaracteristicasState,
        }}>
            {props.children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };
