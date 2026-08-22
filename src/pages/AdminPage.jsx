import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

const SuccessModal = ({ onClose }) => (
  <div className="admin-modal-overlay" onClick={onClose}>
    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
      <div className="admin-modal__icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12 19.79 19.79 0 0 1 1.21 3.18 2 2 0 0 1 3.22 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.62-.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.32 16z"/>
        </svg>
      </div>
      <h3 className="admin-modal__title">Usuario pre-registrado</h3>
      <p className="admin-modal__text">Correo de invitación enviado con 15 créditos.</p>
      <button className="admin-btn admin-btn--primary" onClick={onClose} style={{ width: '100%' }}>
        Cerrar
      </button>
    </div>
  </div>
);

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState('preregister');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [preregEmail, setPreregEmail] = useState('');
  const [preregLoading, setPreregLoading] = useState(false);
  const [preregError, setPreregError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (section !== 'users') return;
    setLoadingUsers(true);
    api.get('/admin/users')
      .then(({ data }) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, [section]);

  const handlePreregister = async (e) => {
    e.preventDefault();
    setPreregError(null);
    setPreregLoading(true);
    try {
      await api.post('/admin/preregister', { email: preregEmail });
      setPreregEmail('');
      setShowModal(true);
    } catch (err) {
      setPreregError(err.response?.data?.message || 'Error al enviar la invitación.');
    } finally {
      setPreregLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const roleLabel = (role) => role === 'admin'
    ? <span className="admin-badge admin-badge--admin">Admin</span>
    : <span className="admin-badge admin-badge--client">Cliente</span>;

  const formatDate = (d) => new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="admin-layout">
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}

      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="admin-navbar__content">
          <Link to="/new-search" className="admin-navbar__logo">Auto Check</Link>
          <div className="admin-navbar__right">
            <span className="admin-navbar__user">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {user?.name || user?.email}
              <span className="admin-navbar__role">Admin</span>
            </span>
            <button className="admin-navbar__logout" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
      </nav>

      <div className="admin-container">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="admin-sidebar__nav">
            <Link to="/new-search" className="admin-sidebar__link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Buscar Placa
            </Link>
            <Link to="/historial" className="admin-sidebar__link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 5H2v7h7V5Z"/><path d="M9 14H2v7h7v-7Z"/><path d="M22 5h-7v7h7V5Z"/><path d="M22 14h-7v7h7v-7Z"/>
              </svg>
              Historial
            </Link>
            <div className="admin-sidebar__divider" />
            <button
              className={`admin-sidebar__link admin-sidebar__link--btn ${section === 'preregister' ? 'active' : ''}`}
              onClick={() => setSection('preregister')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Otorgar Créditos
            </button>
            <button
              className={`admin-sidebar__link admin-sidebar__link--btn ${section === 'users' ? 'active' : ''}`}
              onClick={() => setSection('users')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Usuarios registrados
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="admin-main">
          <h1 className="admin-main__title">
            {section === 'preregister' ? 'Otorgar Créditos' : 'Usuarios registrados'}
          </h1>

          {section === 'preregister' && (
            <section className="admin-section">
              <p className="admin-section__desc">
                Ingresa el correo del invitado. Se enviará un email con 15 créditos y un enlace para registrarse.
              </p>

              {preregError && (
                <div className="admin-alert admin-alert--error">{preregError}</div>
              )}

              <form className="admin-grant-form" onSubmit={handlePreregister}>
                <div className="admin-grant-form__fields">
                  <div className="admin-form-group">
                    <label className="admin-form-group__label" htmlFor="prereg-email">Correo electrónico</label>
                    <input
                      id="prereg-email" type="email" className="admin-form-group__input" required
                      placeholder="invitado@correo.com" value={preregEmail}
                      onChange={(e) => setPreregEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={preregLoading}>
                  {preregLoading
                    ? <><span className="admin-btn__spinner" />Enviando...</>
                    : 'Pre-registrar'}
                </button>
              </form>
            </section>
          )}

          {section === 'users' && (
            <section className="admin-section">
              {loadingUsers ? (
                <p className="admin-loading">Cargando usuarios...</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Créditos</th>
                        <th>Registro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td>{u.name || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                          <td>{u.email}</td>
                          <td>{roleLabel(u.role)}</td>
                          <td><span className="admin-credits">{u.credits}</span></td>
                          <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{formatDate(u.createdAt)}</td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Sin usuarios</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
