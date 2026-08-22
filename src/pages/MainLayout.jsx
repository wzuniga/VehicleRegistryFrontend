import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchPlate from '../components/SearchPlate';
import SearchHistory from '../components/SearchHistory';
import './MainLayout.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // En móvil (max-width: 768px), el sidebar inicia cerrado
    return window.innerWidth > 768;
  });
  const [currentPage, setCurrentPage] = useState('Busca tu Placa');
  const [selectedPlate, setSelectedPlate] = useState(() => {
    // Obtener plate de los query params
    return searchParams.get('plate') || null;
  });

  useEffect(() => {
    const handleResize = () => {
      // Ajustar el sidebar cuando cambia el tamaño de la ventana
      if (window.innerWidth > 768 && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (pageName) => {
    setCurrentPage(pageName);
    // Cerrar el sidebar en modo móvil cuando se selecciona una opción
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSelectPlate = (plate) => {
    setSelectedPlate(plate);
    setCurrentPage('Busca tu Placa');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hola, quiero solicitar un informe vehicular completo');
    window.open(`https://wa.me/51959314336?text=${message}`, '_blank');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="main-layout">
      {/* Navbar Superior */}
      <nav className="top-navbar">
        <div className="navbar-content">
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="navbar-title">Auto Check</h1>
          <div className="navbar-actions">
            <div className="user-profile">
              <div className="avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="user-name">{user?.name || user?.email || 'Usuario'}</span>
              {user?.credits !== undefined && (
                <div style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: 600 }}>{user.credits} créditos</div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="layout-container">
        {/* Menú Lateral Izquierdo */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-content">
            <nav className="sidebar-nav">
              <ul className="sidebar-menu-top">
                <li>
                  <a
                    href="#"
                    className={`sidebar-link ${currentPage === 'Busca tu Placa' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuClick('Busca tu Placa');
                    }}
                  >
                    <span className="icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                    </span>
                    Busca tu Placa
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={`sidebar-link ${currentPage === 'Placas Buscadas' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuClick('Placas Buscadas');
                    }}
                  >
                    <span className="icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 5H2v7h7V5Z"></path>
                        <path d="M9 14H2v7h7v-7Z"></path>
                        <path d="M22 5h-7v7h7V5Z"></path>
                        <path d="M22 14h-7v7h7v-7Z"></path>
                      </svg>
                    </span>
                    Placas Buscadas
                  </a>
                </li>
              </ul>
            </nav>

            <div className="sidebar-footer">
              <ul className="sidebar-menu-bottom">
                <li>
                  <a 
                    href="#" 
                    className="sidebar-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleWhatsApp();
                    }}
                  >
                    <span className="icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </span>
                    Soporte
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="sidebar-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    <span className="icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                    </span>
                    Cerrar Sesión
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="main-content">
          {currentPage === 'Busca tu Placa' && (
            <SearchPlate initialPlate={selectedPlate} />
          )}
          {currentPage === 'Placas Buscadas' && (
            <SearchHistory onSelectPlate={handleSelectPlate} />
          )}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
