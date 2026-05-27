import { createContext, useState, useCallback } from 'react';

/**
 * AppProvider — Context global de la app BolsaEmpleo.
 *
 * Sigue exactamente la misma estructura que el ejemplo del profesor
 * (AppProvider.jsx de Personas/Productos), pero ampliado para todos
 * los módulos del proyecto.
 *
 * Estado global:
 *  - authState     → usuario logueado, rol, cargando
 *  - publicState   → puestos recientes, resultados de búsqueda, árbol de características
 *  - adminState    → empresas pendientes, oferentes pendientes, características
 *  - empresaState  → perfil empresa, puestos, candidatos
 *  - oferenteState → perfil oferente, habilidades, estado del CV
 */

const AppContext = createContext();

const BACKEND = 'http://localhost:8080';

// ── Helper fetch con cookies de sesión ───────────────────────────────
// Siempre envía credentials:'include' para que Spring Security
// reciba la cookie JSESSIONID en cada request.
export async function apiFetch(url, options = {}) {
    const defaults = {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...options.headers },
    };
    const response = await fetch(BACKEND + url, { ...defaults, ...options });
    return response;
}

// ── apiFetchForm — para subir archivos (multipart) ───────────────────
export async function apiFetchForm(url, formData) {
    const response = await fetch(BACKEND + url, {
        method: 'POST',
        credentials: 'include',
        body: formData,  // NO pongas Content-Type: el browser lo setea con el boundary
    });
    return response;
}

function AppProvider({ children }) {

    // ── Auth ─────────────────────────────────────────────────────────
    const [authState, setAuthState] = useState({
        usuario: null,   // { username: 'juan', rol: 'EMP' | 'OFE' | 'ADM' }
        cargando: true,  // true mientras verifica sesión al montar
        error: null,
    });

    // ── Público ──────────────────────────────────────────────────────
    const [publicState, setPublicState] = useState({
        puestosRecientes: [],
        resultadosBusqueda: [],
        caracteristicas: { padres: [], hijos: {} },
    });

    // ── Admin ────────────────────────────────────────────────────────
    const [adminState, setAdminState] = useState({
        empresasPendientes: [],
        oferentesPendientes: [],
        caracteristicas: { todas: [], padres: [], hijos: {} },
        aniosReporte: [],
    });

    // ── Empresa ──────────────────────────────────────────────────────
    const [empresaState, setEmpresaState] = useState({
        perfil: null,
        puestos: [],
        puestoActual: null,      // { puesto, habilidades, caracteristicas }
        candidatos: null,        // { puesto, candidatos: [] }
        oferenteDetalle: null,   // { oferente, habilidades, tieneCv }
    });

    // ── Oferente ─────────────────────────────────────────────────────
    const [oferenteState, setOferenteState] = useState({
        perfil: null,
        habilidades: [],
        caracteristicas: [],
        tieneCv: false,
    });

    return (
        <AppContext.Provider value={{
            BACKEND,
            authState,      setAuthState,
            publicState,    setPublicState,
            adminState,     setAdminState,
            empresaState,   setEmpresaState,
            oferenteState,  setOferenteState,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };
