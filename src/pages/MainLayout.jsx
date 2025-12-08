import { useState } from 'react';
import SearchPlate from '../components/SearchPlate';
import SearchHistory from '../components/SearchHistory';
import './MainLayout.css';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('Busca tu Placa');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (pageName) => {
    setCurrentPage(pageName);
  };

  return (
    <div className="main-layout">
      {/* Navbar Superior */}
      <nav className="top-navbar">
        <div className="navbar-content">
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="navbar-title">{currentPage}</h1>
          <div className="navbar-actions">
            <div className="user-profile">
              <div className="avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="user-name">Test User</span>
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
                  <a href="#" className="sidebar-link">
                    <span className="icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </span>
                    Soporte
                  </a>
                </li>
                <li>
                  <a href="#" className="sidebar-link">
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
          {currentPage === 'Busca tu Placa' && <SearchPlate />}
          {currentPage === 'Placas Buscadas' && <SearchHistory />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
