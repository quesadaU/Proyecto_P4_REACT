import './index.css';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/AppProvider.jsx';
import Inicio from './pages/inicio/Inicio.jsx';
import BuscaPuesto from './pages/buscaPuesto/BuscaPuesto.jsx';
import Empresas from './pages/empresas/Empresas.jsx';
import Oferentes from './pages/oferentes/Oferentes.jsx';
import Caracteristicas from './pages/caracteristicas/Caracteristicas.jsx';
import Puestos from './pages/puestos/Puestos.jsx';
import Login from './pages/login/Login.jsx';
import RegistroEmpresa from './pages/registro/RegistroEmpresa.jsx';
import RegistroOferente from './pages/registro/RegistroOferente.jsx';
import Pendiente from './pages/pendiente/Pendiente.jsx';

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <Header />
                <Main />
                <Footer />
            </BrowserRouter>
        </AppProvider>
    );
}

function Header() {
    return (
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
                        <Link className="nav-link" to="/buscar">Buscar Puesto</Link>
                        <Link className="nav-link" to="/empresas">Empresas</Link>
                        <Link className="nav-link" to="/oferentes">Oferentes</Link>
                        <Link className="nav-link" to="/login">Login</Link>
                    </div>
                </div>
            </nav>
            <div className="container hero-content text-center">
                <p className="hero-eyebrow">¿Buscas tu proximo gran proyecto?</p>
                <h1 className="hero-title">Encuentra tu próximo empleo</h1>
            </div>
        </section>
    );
}

function Main() {
    return (
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/buscar" element={<BuscaPuesto />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/oferentes" element={<Oferentes />} />
            <Route path="/caracteristicas" element={<Caracteristicas />} />
            <Route path="/puestos" element={<Puestos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro/empresa" element={<RegistroEmpresa />} />
            <Route path="/registro/oferente" element={<RegistroOferente />} />
            <Route path="/pendiente" element={<Pendiente />} />
        </Routes>
    );
}

function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <strong>Bolsa de Empleo</strong><br/>
                        Estudiantes de Ingenieria en Sistemas de la UNA
                    </div>
                    <div className="col-md-6 text-md-end">
                        Contacto: info@bolsaempleo.local<br/>
                        Créditos: Universidad Nacional de Costa Rica
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default App;
