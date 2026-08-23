import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './AdminPage.css';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
);
const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const CreditsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const DetectionsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);

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

const DETECTIONS_PAGE_SIZE = 12;

const formatImageSize = (base64) => {
  if (!base64) return '—';
  const bytes = (base64.length * 3) / 4;
  const kb = bytes / 1024;
  return kb >= 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${Math.round(kb)} KB`;
};

const DetectionImage = ({ base64, onDimensions, onClick }) => {
  const src = `data:image/jpeg;base64,${base64}`;
  return (
    <img
      src={src}
      alt="Placa detectada"
      className="admin-detection-card__image"
      onLoad={(e) => onDimensions?.(e.target.naturalWidth, e.target.naturalHeight)}
      onError={(e) => { e.target.style.display = 'none'; }}
      onClick={onClick}
    />
  );
};

const ImageLightbox = ({ base64, onClose }) => (
  <div className="admin-lightbox-overlay" onClick={onClose}>
    <img
      src={`data:image/jpeg;base64,${base64}`}
      alt="Placa detectada (ampliada)"
      className="admin-lightbox-image"
      onClick={(e) => e.stopPropagation()}
    />
    <button className="admin-lightbox-close" onClick={onClose} aria-label="Cerrar">✕</button>
  </div>
);

const DetectionCard = ({ detection, onSave, onExpandImage }) => {
  const [plate, setPlate] = useState(detection.possiblePlate || '');
  const [dims, setDims] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = plate !== (detection.possiblePlate || '');

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await onSave(detection.id, plate);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="admin-detection-card">
      <DetectionImage
        base64={detection.imageBase64}
        onDimensions={(w, h) => setDims(`${w}×${h}px`)}
        onClick={() => onExpandImage(detection.imageBase64)}
      />

      <div className="admin-detection-card__body">
        <div className="admin-detection-card__row">
          <span className={`admin-badge ${detection.reviewed ? 'admin-badge--admin' : 'admin-badge--client'}`}>
            {detection.reviewed ? 'Revisada' : 'Pendiente'}
          </span>
          <span className="admin-detection-card__date">{formatDate(detection.createdAt)}</span>
        </div>

        <div className="admin-detection-card__plate-form">
          <label className="admin-form-group__label" htmlFor={`plate-${detection.id}`}>Placa detectada</label>
          <div className="admin-detection-card__plate-inputrow">
            <input
              id={`plate-${detection.id}`}
              type="text"
              className="admin-form-group__input"
              value={plate}
              placeholder="Sin detectar"
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              maxLength={20}
            />
            <button
              className="admin-btn admin-btn--primary admin-btn--sm"
              onClick={handleSave}
              disabled={!dirty || saving || !plate}
            >
              {saving ? '...' : saved ? '✓' : 'Guardar'}
            </button>
          </div>
        </div>

        <div className="admin-detection-card__meta">
          <span>Peso: {formatImageSize(detection.imageBase64)}</span>
          <span>Dimensiones: {dims || '—'}</span>
        </div>
      </div>
    </div>
  );
};

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

  const [detections, setDetections] = useState([]);
  const [detectionsPage, setDetectionsPage] = useState(1);
  const [detectionsTotalPages, setDetectionsTotalPages] = useState(1);
  const [detectionsTotal, setDetectionsTotal] = useState(0);
  const [loadingDetections, setLoadingDetections] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (section !== 'users') return;
    setLoadingUsers(true);
    api.get('/admin/users')
      .then(({ data }) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, [section]);

  useEffect(() => {
    if (section !== 'detections') return;
    setLoadingDetections(true);
    api.get('/plate-detections', { params: { page: detectionsPage, limit: DETECTIONS_PAGE_SIZE } })
      .then(({ data }) => {
        setDetections(data.data);
        setDetectionsTotalPages(data.totalPages);
        setDetectionsTotal(data.total);
      })
      .catch(() => {})
      .finally(() => setLoadingDetections(false));
  }, [section, detectionsPage]);

  const handleSaveDetectionPlate = async (id, possiblePlate) => {
    const { data } = await api.patch(`/plate-detections/${id}`, { possiblePlate });
    setDetections((prev) => prev.map((d) => (d.id === id ? data : d)));
  };

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

  const sidebarItems = [
    { key: 'search', label: 'Buscar Placa', icon: <SearchIcon />, to: '/new-search' },
    { key: 'historial', label: 'Historial', icon: <HistoryIcon />, to: '/historial' },
    { key: 'preregister', label: 'Otorgar Créditos', icon: <CreditsIcon />, onClick: () => setSection('preregister'), active: section === 'preregister' },
    { key: 'users', label: 'Usuarios registrados', icon: <UsersIcon />, onClick: () => setSection('users'), active: section === 'users' },
    { key: 'detections', label: 'Detecciones de Placas', icon: <DetectionsIcon />, onClick: () => setSection('detections'), active: section === 'detections' },
  ];

  const sidebarFooterItems = [
    { key: 'logout', label: 'Cerrar sesión', icon: <LogoutIcon />, onClick: handleLogout },
  ];

  return (
    <div className="admin-layout">
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}
      {expandedImage && <ImageLightbox base64={expandedImage} onClose={() => setExpandedImage(null)} />}

      <Navbar onToggleSidebar={() => setIsSidebarOpen((v) => !v)} user={user} />

      <div className="admin-container">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          items={sidebarItems}
          footerItems={sidebarFooterItems}
        />

        {/* Main */}
        <main className="admin-main">
          <h1 className="admin-main__title">
            {section === 'preregister' ? 'Otorgar Créditos' : section === 'users' ? 'Usuarios registrados' : 'Detecciones de Placas'}
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

          {section === 'detections' && (
            <section className="admin-section">
              <p className="admin-section__desc">
                Imágenes recibidas de la app de detección de placas. {detectionsTotal} en total.
              </p>

              {loadingDetections ? (
                <p className="admin-loading">Cargando detecciones...</p>
              ) : (
                <>
                  <div className="admin-detections-grid">
                    {detections.map((d) => (
                      <DetectionCard
                        key={d.id}
                        detection={d}
                        onSave={handleSaveDetectionPlate}
                        onExpandImage={setExpandedImage}
                      />
                    ))}
                    {detections.length === 0 && (
                      <p className="admin-loading">Sin detecciones todavía.</p>
                    )}
                  </div>

                  {detectionsTotalPages > 1 && (
                    <div className="admin-pagination">
                      <button
                        className="admin-btn admin-btn--secondary"
                        onClick={() => setDetectionsPage((p) => Math.max(1, p - 1))}
                        disabled={detectionsPage <= 1}
                      >
                        ← Anterior
                      </button>
                      <span className="admin-pagination__label">
                        Página {detectionsPage} de {detectionsTotalPages}
                      </span>
                      <button
                        className="admin-btn admin-btn--secondary"
                        onClick={() => setDetectionsPage((p) => Math.min(detectionsTotalPages, p + 1))}
                        disabled={detectionsPage >= detectionsTotalPages}
                      >
                        Siguiente →
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
