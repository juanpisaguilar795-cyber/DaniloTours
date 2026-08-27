import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import DashboardView from './components/DashboardView';
import ClientsView from './components/ClientsView';
import ActivitiesView from './components/ActivitiesView';
import ReservationsView from './components/ReservationsView';
import PublicLandingView from './components/PublicLandingView';
import PoliticasView from './components/PoliticasView';

type ViewType = 'dashboard' | 'clients' | 'activities' | 'reservations';

function App() {
  if (window.location.pathname === '/politicas-de-cancelacion') {
    return <PoliticasView />;
  }

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [time, setTime] = useState(new Date());
  
  // Login Security State (Database Driven)
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return { title: 'Panel de Control', desc: 'Resumen de ventas, estadísticas y estado general de la agencia.' };
      case 'clients':
        return { title: 'Control de Turistas', desc: 'Administra la información de clientes, pasaportes e historiales.' };
      case 'activities':
        return { title: 'Catálogo de Actividades', desc: 'Configura las actividades, locaciones, tarifas y capacidades.' };
      case 'reservations':
        return { title: 'Gestión de Reservas', desc: 'Flujo interactivo de boletos, estados de viaje y cupos en tiempo real.' };
      default:
        return { title: 'DaniloTours', desc: 'Gestor Integral de Turismo' };
    }
  };

  const pageInfo = getPageTitle();

  const handleAdminAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        setIsAdminMode(true);
        setShowLoginModal(false);
        setEmail('');
        setPassword('');
      } else {
        setLoginError(data.message || 'Credenciales incorrectas. Intente nuevamente.');
      }
    } catch (error) {
      setLoginError('Error de conexión con el servidor.');
      console.error('Error logging in:', error);
    } finally {
      setLoginLoading(false);
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setEmail('');
    setPassword('');
    setLoginError('');
  };

  if (!isAdminMode) {
    return (
      <>
        <PublicLandingView onEnterAdmin={() => setShowLoginModal(true)} />
        {showLoginModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '420px' }}>
              <div className="modal-header">
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0A74C9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Área Protegida
                  </span>
                  <h3 className="modal-title" style={{ marginTop: '0.15rem' }}>
                    Acceso Administrativo
                  </h3>
                </div>
                <button onClick={closeLoginModal} className="modal-close" disabled={loginLoading}>&times;</button>
              </div>

              <form onSubmit={handleAdminAccess}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    required
                    disabled={loginLoading}
                    autoFocus
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                    disabled={loginLoading}
                  />
                  {loginError && (
                    <div className="form-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: '600' }}>
                      {loginError}
                    </div>
                  )}
                </div>

                <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={closeLoginModal}
                    className="btn-secondary"
                    style={{ padding: '0.6rem 1.25rem' }}
                    disabled={loginLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    disabled={loginLoading}
                  >
                    {loginLoading ? 'Ingresando...' : 'Ingresar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="brand-section">
            <div className="brand-logo-container">
              <img src="/images/logo.png" alt="DaniloTours Logo" className="brand-logo" />
            </div>
            <div className="brand-name">DaniloTours</div>
          </div>

          <nav className="navigation-menu">
            <div 
              className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('dashboard')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
              <span>Dashboard</span>
            </div>

            <div 
              className={`nav-item ${activeView === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveView('clients')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Clientes</span>
            </div>

            <div 
              className={`nav-item ${activeView === 'activities' ? 'active' : ''}`}
              onClick={() => setActiveView('activities')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Actividades</span>
            </div>

            <div 
              className={`nav-item ${activeView === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveView('reservations')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Reservas</span>
            </div>
          </nav>
        </div>

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => setIsAdminMode(false)}
            style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid #0A74C9', color: '#0A74C9', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
          >
            ← Volver a la Web
          </button>
          <div>
            <div>Operadora de Turismo D.C.</div>
            <div className="rnt-badge">R.N.T. 14316</div>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content">
        <header className="header">
          <div className="page-title-section">
            <h1>{pageInfo.title}</h1>
            <p>{pageInfo.desc}</p>
          </div>
          <div className="header-actions">
            <span className="current-time">{formatTime(time)}</span>
          </div>
        </header>

        {/* View Router */}
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'clients' && <ClientsView />}
        {activeView === 'activities' && <ActivitiesView />}
        {activeView === 'reservations' && <ReservationsView />}
      </main>
    </div>
  );
}

// React 18 Mounting
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
