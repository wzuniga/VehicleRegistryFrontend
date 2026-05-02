import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './AppLayout.css';

const AppLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Navbar Superior */}
      <nav className="app-navbar">
        <div className="app-navbar__content">
          <button className="app-navbar__toggle" onClick={() => setIsSidebarOpen(v => !v)} aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="app-navbar__title">Auto Check</h1>
          <div className="app-navbar__user">
            <div className="app-navbar__avatar" aria-hidden="true">TU</div>
            <span className="app-navbar__username">Test User</span>
          </div>
        </div>
      </nav>

      <div className="app-layout__body">
        {/* Overlay mobile */}
        {isSidebarOpen && (
          <div
            className="app-sidebar__overlay"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside className={`app-sidebar ${isSidebarOpen ? 'app-sidebar--open' : 'app-sidebar--closed'}`}>
          <div className="app-sidebar__inner">
            <nav className="app-sidebar__nav">
              <ul className="app-sidebar__menu">
                <li>
                  <NavLink
                    to="/new-search"
                    className={({ isActive }) => `app-sidebar__link${isActive ? ' app-sidebar__link--active' : ''}`}
                    onClick={closeSidebarOnMobile}
                  >
                    <span className="app-sidebar__icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    </span>
                    Busqueda
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/historial"
                    className={({ isActive }) => `app-sidebar__link${isActive ? ' app-sidebar__link--active' : ''}`}
                    onClick={closeSidebarOnMobile}
                  >
                    <span className="app-sidebar__icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </span>
                    Historial
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/manualfilter"
                    className={({ isActive }) => `app-sidebar__link${isActive ? ' app-sidebar__link--active' : ''}`}
                    onClick={closeSidebarOnMobile}
                  >
                    <span className="app-sidebar__icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </span>
                    Busqueda Manual
                  </NavLink>
                </li>
              </ul>
            </nav>

            <div className="app-sidebar__footer">
              <ul className="app-sidebar__menu">
                <li>
                  <NavLink
                    to="/configurar"
                    className={({ isActive }) => `app-sidebar__link${isActive ? ' app-sidebar__link--active' : ''}`}
                    onClick={closeSidebarOnMobile}
                  >
                    <span className="app-sidebar__icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    </span>
                    Configurar
                  </NavLink>
                </li>
                <li>
                  <button
                    className="app-sidebar__link app-sidebar__link--btn"
                    onClick={() => { navigate('/'); closeSidebarOnMobile(); }}
                  >
                    <span className="app-sidebar__icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    </span>
                    Salir
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
